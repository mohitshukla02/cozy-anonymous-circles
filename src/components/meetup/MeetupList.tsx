
import React from 'react';
import MeetupCard from '../MeetupCard';

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

interface MeetupListProps {
  meetups: Meetup[];
  currentUserId: string;
  onRsvp: (meetupId: string, status: 'attending' | 'not_attending' | 'suggest_new_time') => void;
  onCheckIn: (meetupId: string) => void;
  canCheckIn: (meetup: Meetup) => boolean;
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
  return (
    <div className="space-y-4">
      {meetups.map(meetup => (
        <MeetupCard
          key={meetup.id}
          meetup={meetup}
          currentUserId={currentUserId}
          userRsvpStatus={userRSVPs[meetup.id] as 'attending' | 'not_attending' | 'suggest_new_time' | undefined}
          userCheckedIn={userCheckIns[meetup.id] || false}
          onRsvp={(status) => onRsvp(meetup.id, status)}
          onCheckIn={() => onCheckIn(meetup.id)}
          canCheckIn={canCheckIn(meetup)}
        />
      ))}
    </div>
  );
};

export default MeetupList;
