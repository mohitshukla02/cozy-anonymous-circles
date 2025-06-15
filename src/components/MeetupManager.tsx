
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import MeetupHeader from './meetup/MeetupHeader';
import MeetupEmptyState from './meetup/MeetupEmptyState';
import MeetupList from './meetup/MeetupList';
import PlanMeetupModal from './PlanMeetupModal';
import { useToast } from '../hooks/use-toast';

interface Meetup {
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
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);

  useEffect(() => {
    loadMeetups();
  }, [groupId]);

  const loadMeetups = async () => {
    setIsLoading(true);
    try {
      // Simulate loading meetups from API
      // In real implementation, this would fetch from Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      setMeetups([]);
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
    console.log('RSVP to meetup:', meetupId, status);
    // Update local state and sync with backend
  };

  const handleCheckIn = async (meetupId: string) => {
    console.log('Check in to meetup:', meetupId);
    // Update local state and sync with backend
  };

  const canCheckIn = (meetup: Meetup) => {
    const meetupDate = new Date(meetup.dateTime);
    const now = new Date();
    const twoHoursBefore = new Date(meetupDate.getTime() - 2 * 60 * 60 * 1000);
    const sixHoursAfter = new Date(meetupDate.getTime() + 6 * 60 * 60 * 1000);
    
    return now >= twoHoursBefore && now <= sixHoursAfter;
  };

  const handlePlanMeetup = () => {
    setShowPlanModal(true);
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
        onMeetupCreated={() => {
          loadMeetups();
          toast({
            title: "Meetup Created!",
            description: "Your group members will be notified"
          });
        }}
      />
    </div>
  );
};

export default MeetupManager;
