
import React from 'react';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';

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
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{meetup.rsvpCount} RSVPs</span>
                </div>
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(meetup.status)}`}>
              {meetup.status}
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {!userRSVPs[meetup.id] && (
              <>
                <button
                  onClick={() => onRsvp(meetup.id, 'attending')}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                >
                  Attending
                </button>
                <button
                  onClick={() => onRsvp(meetup.id, 'not_attending')}
                  className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                >
                  Can't make it
                </button>
              </>
            )}

            {userRSVPs[meetup.id] === 'attending' && !userCheckIns[meetup.id] && canCheckIn(meetup) && (
              <button
                onClick={() => onCheckIn(meetup.id)}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
              >
                Check In
              </button>
            )}

            {userRSVPs[meetup.id] && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                RSVP: {userRSVPs[meetup.id]}
                {userCheckIns[meetup.id] && ' (Checked in)'}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MeetupList;
