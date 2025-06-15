
import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import MeetupCard from './MeetupCard';
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

  if (!isLocalGroup) {
    return null; // Only show for local meetup groups
  }

  return (
    <div className="space-y-6">
      {/* Header with Plan Meetup button */}
      <Card className="rounded-2xl border-0 shadow-sm bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Meetups
            </CardTitle>
            <Button onClick={() => setShowPlanModal(true)} size="sm" className="rounded-xl">
              <Plus size={14} className="mr-1" />
              Plan Meetup
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading meetups...
            </div>
          ) : meetups.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No meetups planned</h3>
              <p className="text-gray-600 text-sm mb-4">
                Start building your community by planning the first meetup!
              </p>
              <Button onClick={() => setShowPlanModal(true)} size="sm">
                Plan First Meetup
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {meetups.map(meetup => (
                <MeetupCard
                  key={meetup.id}
                  meetup={meetup}
                  currentUserId={currentUserId}
                  userRsvpStatus={undefined} // Would come from backend
                  userCheckedIn={false} // Would come from backend
                  onRsvp={(status) => handleRsvp(meetup.id, status)}
                  onCheckIn={() => handleCheckIn(meetup.id)}
                  canCheckIn={canCheckIn(meetup)}
                />
              ))}
            </div>
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
