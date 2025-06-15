
import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { Meetup } from '@/types/meetup';

interface MeetupListProps {
  meetups: Meetup[];
  selectedMeetup: Meetup | null;
  onMeetupSelect: (meetup: Meetup) => void;
}

const MeetupList = ({ meetups, selectedMeetup, onMeetupSelect }: MeetupListProps) => {
  return (
    <div>
      <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-4">This week's events</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {meetups.map((meetup) => (
          <div
            key={meetup.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedMeetup?.id === meetup.id
                ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-700'
                : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
            }`}
            onClick={() => onMeetupSelect(meetup)}
          >
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">{meetup.title}</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{meetup.groupName}</p>
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{new Date(meetup.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>{meetup.attendees}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetupList;
