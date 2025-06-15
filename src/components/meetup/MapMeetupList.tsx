
import React from 'react';
import { Calendar, Users, MapPin } from 'lucide-react';
import { Meetup } from '@/types/meetup';

interface MapMeetupListProps {
  meetups: Meetup[];
  selectedMeetup: Meetup | null;
  onMeetupSelect: (meetup: Meetup) => void;
}

const MapMeetupList = ({ meetups, selectedMeetup, onMeetupSelect }: MapMeetupListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-4">Upcoming Events</h3>
      {meetups.map((meetup) => (
        <div
          key={meetup.id}
          onClick={() => onMeetupSelect(meetup)}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            selectedMeetup?.id === meetup.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700'
          }`}
        >
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            {meetup.title}
          </h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            {meetup.groupName}
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{new Date(meetup.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span>{meetup.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>{meetup.attendees} attending</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MapMeetupList;
