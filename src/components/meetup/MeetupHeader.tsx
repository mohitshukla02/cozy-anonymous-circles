
import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { CardHeader, CardTitle } from '../ui/card';

interface MeetupHeaderProps {
  onPlanMeetup: () => void;
}

const MeetupHeader = ({ onPlanMeetup }: MeetupHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar size={20} />
          Meetups
        </CardTitle>
        <Button onClick={onPlanMeetup} size="sm" className="rounded-xl">
          <Plus size={14} className="mr-1" />
          Plan Meetup
        </Button>
      </div>
    </CardHeader>
  );
};

export default MeetupHeader;
