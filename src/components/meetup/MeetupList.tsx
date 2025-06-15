
import React, { useState } from 'react';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';
import RSVPActions from './RSVPActions';
import MeetupRecapModal from './MeetupRecapModal';
import { useNotifications } from '../../hooks/useNotifications';

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

interface MeetupListProps {
  meetups: DatabaseMeetup[];
  currentUserId: string;
  onRsvp: (meetupId: string, status: 'attending' | 'not_attending' | 'suggest_new_time') => void;
  onCheckIn: (meetupId: string) => void;
  canCheckIn: (meetup: DatabaseMeetup) => boolean;
  userRSVPs: Record<string, string>;
  userCheckIns: Record<string, boolean>;
}

const MeetupList = ({ 
  meetups, 
  currentUserId, 
  onRsvp, 
  onCheckIn, 
  canCheckIn, 
  userRSVPs, 
  userCheckIns 
}: MeetupListProps) => {
  const { createNotification } = useNotifications();
  const [showRecapModal, setShowRecapModal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'cancelled':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const handleRsvp = async (meetupId: string, status: 'attending' | 'not_attending' | 'suggest_new_time') => {
    setIsLoading(true);
    try {
      await onRsvp(meetupId, status);
      
      // Create notification for meetup creator
      const meetup = meetups.find(m => m.id === meetupId);
      if (meetup && meetup.createdBy !== currentUserId) {
        const statusText = status === 'attending' ? 'will attend' : 
                          status === 'not_attending' ? 'can\'t attend' : 
                          'suggested a new time for';
        
        await createNotification(
          meetup.createdBy,
          'rsvp_update',
          'RSVP Update',
          `Someone ${statusText} your meetup "${meetup.title}"`,
          { meetupId, status }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async (meetupId: string) => {
    setIsLoading(true);
    try {
      await onCheckIn(meetupId);
      
      // Check if this creates a successful meetup
      const meetup = meetups.find(m => m.id === meetupId);
      if (meetup && meetup.checkinCount + 1 >= 3) {
        // Show recap modal after successful check-in
        setTimeout(() => {
          setShowRecapModal(meetupId);
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRecap = async (recap: string) => {
    // This would integrate with the post creation system
    // For now, we'll just close the modal
    setShowRecapModal(null);
  };

  const selectedMeetup = meetups.find(m => m.id === showRecapModal);

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-4">Upcoming Meetups</h3>
      {meetups.map((meetup) => (
        <div
          key={meetup.id}
          className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                {meetup.title}
              </h4>
              {meetup.description && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  {meetup.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{formatDate(meetup.dateTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  <span>{meetup.location}</span>
                </div>
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(meetup.status)}`}>
              {meetup.status}
            </span>
          </div>

          <RSVPActions
            meetupId={meetup.id}
            currentUserId={currentUserId}
            userRsvpStatus={userRSVPs[meetup.id] as 'attending' | 'not_attending' | 'suggest_new_time'}
            userCheckedIn={userCheckIns[meetup.id]}
            rsvpCount={meetup.rsvpCount}
            checkinCount={meetup.checkinCount}
            canCheckIn={canCheckIn(meetup)}
            isLoading={isLoading}
            onRsvp={(status) => handleRsvp(meetup.id, status)}
            onCheckIn={() => handleCheckIn(meetup.id)}
          />
        </div>
      ))}

      {/* Recap Modal */}
      {showRecapModal && selectedMeetup && (
        <MeetupRecapModal
          isOpen={true}
          onClose={() => setShowRecapModal(null)}
          meetupTitle={selectedMeetup.title}
          onSubmitRecap={handleSubmitRecap}
        />
      )}
    </div>
  );
};

export default MeetupList;
