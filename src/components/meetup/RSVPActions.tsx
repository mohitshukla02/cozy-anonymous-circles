
import React from 'react';
import { Clock, Users, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface RSVPActionsProps {
  meetupId: string;
  currentUserId: string;
  userRsvpStatus?: 'attending' | 'not_attending' | 'suggest_new_time';
  userCheckedIn?: boolean;
  rsvpCount: number;
  checkinCount: number;
  canCheckIn: boolean;
  isLoading: boolean;
  onRsvp: (status: 'attending' | 'not_attending' | 'suggest_new_time') => void;
  onCheckIn: () => void;
}

const RSVPActions = ({ 
  userRsvpStatus, 
  userCheckedIn, 
  rsvpCount, 
  canCheckIn, 
  isLoading,
  onRsvp, 
  onCheckIn 
}: RSVPActionsProps) => {
  const attendingCount = rsvpCount;
  const needsMore = Math.max(0, 3 - attendingCount);

  return (
    <div className="space-y-3">
      {/* Live RSVP Indicator */}
      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <Users size={14} />
          <span>{attendingCount} attending</span>
        </div>
        {needsMore > 0 ? (
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            {needsMore} more needed to confirm
          </Badge>
        ) : (
          <Badge className="bg-green-100 text-green-800">
            Meetup confirmed!
          </Badge>
        )}
      </div>

      {/* RSVP Actions */}
      {!userRsvpStatus && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => onRsvp('attending')}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Count me in
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRsvp('not_attending')}
              disabled={isLoading}
              className="flex-1"
            >
              Can't make it
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRsvp('suggest_new_time')}
            disabled={isLoading}
            className="w-full text-xs flex items-center gap-1"
          >
            <Clock size={12} />
            Suggest new time
          </Button>
        </div>
      )}

      {/* Check-in Action */}
      {canCheckIn && userRsvpStatus === 'attending' && !userCheckedIn && (
        <Button
          onClick={onCheckIn}
          disabled={isLoading}
          className="w-full"
        >
          <CheckCircle size={16} className="mr-2" />
          Check In Now
        </Button>
      )}

      {/* Status Display */}
      {userRsvpStatus && (
        <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <span className="text-sm text-blue-700 dark:text-blue-300">
            You're {userRsvpStatus === 'suggest_new_time' ? 'suggesting a new time' : userRsvpStatus}
            {userCheckedIn && ' (Checked in ✓)'}
          </span>
        </div>
      )}
    </div>
  );
};

export default RSVPActions;
