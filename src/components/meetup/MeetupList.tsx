
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
}

const MeetupList = ({ meetups, currentUserId, onRsvp, onCheckIn, canCheckIn }: MeetupListProps) => {
  return (
    <div className="space-y-4">
      {meetups.map(meetup => (
        <MeetupCard
          key={meetup.id}
          meetup={meetup}
          currentUserId={currentUserId}
          userRsvpStatus={undefined} // Would come from backend
          userCheckedIn={false} // Would come from backend
          onRsvp={(status) => onRsvp(meetup.id, status)}
          onCheckIn={() => onCheckIn(meetup.id)}
          canCheckIn={canCheckIn(meetup)}
        />
      ))}
    </div>
  );
};

export default MeetupList;
