
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '../ui/button';

interface MeetupEmptyStateProps {
  onPlanMeetup: () => void;
}

const MeetupEmptyState = ({ onPlanMeetup }: MeetupEmptyStateProps) => {
  return (
    <div className="text-center py-8">
      <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="font-semibold text-gray-900 mb-2">No meetups planned</h3>
      <p className="text-gray-600 text-sm mb-4">
        Start building your community by planning the first meetup!
      </p>
      <Button onClick={onPlanMeetup} size="sm">
        Plan First Meetup
      </Button>
    </div>
  );
};

export default MeetupEmptyState;
