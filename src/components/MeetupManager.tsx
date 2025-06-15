
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import MeetupHeader from './meetup/MeetupHeader';
import MeetupEmptyState from './meetup/MeetupEmptyState';
import MeetupList from './meetup/MeetupList';
import PlanMeetupModal from './PlanMeetupModal';
import { useToast } from '../hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createMeetup, rsvpToMeetup, checkInToMeetup } from '../utils/meetupHelpers';

interface DatabaseMeetup {
  id: string;
  title: string;
  description?: string;
  dateTime: string;
  location: string;
  purpose: string;
  status: 'planned' | 'successful' | 'failed' | 'cancelled';
  rsvpCount: number;
  checkinCount: number;
  createdBy: string;
}

interface MeetupManagerProps {
  groupId: string;
  groupName: string;
  currentUserId: string;
  isLocalGroup: boolean;
}

const MeetupManager = ({ groupId, groupName, currentUserId, isLocalGroup }: MeetupManagerProps) => {
  const { toast } = useToast();
  const [meetups, setMeetups] = useState<DatabaseMeetup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [userRSVPs, setUserRSVPs] = useState<Record<string, string>>({});
  const [userCheckIns, setUserCheckIns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadMeetups();
  }, [groupId]);

  const loadMeetups = async () => {
    setIsLoading(true);
    try {
      // Fetch meetups from Supabase
      const { data: meetupsData, error: meetupsError } = await supabase
        .from('meetups')
        .select('*')
        .eq('group_id', groupId)
        .order('date_time', { ascending: true });

      if (meetupsError) {
        console.error('Error loading meetups:', meetupsError);
        toast({
          title: "Error",
          description: "Failed to load meetups",
          variant: "destructive"
        });
        return;
      }

      // Transform the data to match our interface
      const transformedMeetups = meetupsData?.map(meetup => ({
        id: meetup.id,
        title: meetup.title,
        description: meetup.description,
        dateTime: meetup.date_time,
        location: meetup.location,
        purpose: meetup.purpose,
        status: meetup.status as 'planned' | 'successful' | 'failed' | 'cancelled',
        rsvpCount: meetup.rsvp_count,
        checkinCount: meetup.checkin_count,
        createdBy: meetup.created_by
      })) || [];

      setMeetups(transformedMeetups);

      // Load user RSVPs
      if (transformedMeetups.length > 0) {
        const meetupIds = transformedMeetups.map(m => m.id);
        const { data: rsvpData } = await supabase
          .from('meetup_rsvps')
          .select('meetup_id, status, checked_in')
          .eq('user_id', currentUserId)
          .in('meetup_id', meetupIds);

        const rsvpMap: Record<string, string> = {};
        const checkInMap: Record<string, boolean> = {};
        
        rsvpData?.forEach(rsvp => {
          rsvpMap[rsvp.meetup_id] = rsvp.status;
          checkInMap[rsvp.meetup_id] = rsvp.checked_in || false;
        });

        setUserRSVPs(rsvpMap);
        setUserCheckIns(checkInMap);
      }
    } catch (error) {
      console.error('Error loading meetups:', error);
      toast({
        title: "Error",
        description: "Failed to load meetups",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRsvp = async (meetupId: string, status: 'attending' | 'not_attending' | 'suggest_new_time') => {
    try {
      const rsvpStatus = status === 'attending' ? 'attending' : 
                        status === 'not_attending' ? 'not_attending' : 
                        'interested'; // Map suggest_new_time to interested for now

      const success = await rsvpToMeetup(meetupId, currentUserId, rsvpStatus);
      
      if (success) {
        setUserRSVPs(prev => ({ ...prev, [meetupId]: rsvpStatus }));
        loadMeetups(); // Reload to get updated counts
        
        const statusText = status === 'attending' ? 'attending' : 
                          status === 'not_attending' ? 'not attending' : 
                          'suggesting new time';
        toast({
          title: "RSVP Updated",
          description: `You're now marked as ${statusText}`
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update RSVP",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
      toast({
        title: "Error",
        description: "Failed to update RSVP",
        variant: "destructive"
      });
    }
  };

  const handleCheckIn = async (meetupId: string) => {
    try {
      const success = await checkInToMeetup(meetupId, currentUserId);
      
      if (success) {
        setUserCheckIns(prev => ({ ...prev, [meetupId]: true }));
        loadMeetups(); // Reload to get updated counts and status
        toast({
          title: "Checked In!",
          description: "You're now checked in to this meetup"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to check in",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error checking in:', error);
      toast({
        title: "Error",
        description: "Failed to check in",
        variant: "destructive"
      });
    }
  };

  const canCheckIn = (meetup: DatabaseMeetup) => {
    const meetupDate = new Date(meetup.dateTime);
    const now = new Date();
    const twoHoursBefore = new Date(meetupDate.getTime() - 2 * 60 * 60 * 1000);
    const sixHoursAfter = new Date(meetupDate.getTime() + 6 * 60 * 60 * 1000);
    
    return now >= twoHoursBefore && now <= sixHoursAfter;
  };

  const handlePlanMeetup = () => {
    setShowPlanModal(true);
  };

  const handleMeetupCreated = async (meetupData: {
    title: string;
    description?: string;
    dateTime: string;
    location: string;
    purpose: string;
  }) => {
    try {
      const success = await createMeetup({
        groupId,
        title: meetupData.title,
        description: meetupData.description,
        dateTime: meetupData.dateTime,
        location: meetupData.location,
        createdBy: currentUserId
      });

      if (success) {
        loadMeetups();
        toast({
          title: "Meetup Created!",
          description: "Your group members will be notified"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create meetup",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating meetup:', error);
      toast({
        title: "Error",
        description: "Failed to create meetup",
        variant: "destructive"
      });
    }
  };

  if (!isLocalGroup) {
    return null; // Only show for local meetup groups
  }

  return (
    <div className="space-y-6">
      {/* Header with Plan Meetup button */}
      <Card className="rounded-2xl border-0 shadow-sm bg-white/90 backdrop-blur-sm">
        <MeetupHeader onPlanMeetup={handlePlanMeetup} />
        
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading meetups...
            </div>
          ) : meetups.length === 0 ? (
            <MeetupEmptyState onPlanMeetup={handlePlanMeetup} />
          ) : (
            <MeetupList
              meetups={meetups}
              currentUserId={currentUserId}
              onRsvp={handleRsvp}
              onCheckIn={handleCheckIn}
              canCheckIn={canCheckIn}
              userRSVPs={userRSVPs}
              userCheckIns={userCheckIns}
            />
          )}
        </CardContent>
      </Card>

      {/* Plan Meetup Modal */}
      <PlanMeetupModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        groupId={groupId}
        groupName={groupName}
        onMeetupCreated={handleMeetupCreated}
      />
    </div>
  );
};

export default MeetupManager;
