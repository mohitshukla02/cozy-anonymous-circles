
import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Meetup } from '@/types/meetup';

interface SelectedMeetupDetailsProps {
  meetup: Meetup;
}

const SelectedMeetupDetails = ({ meetup }: SelectedMeetupDetailsProps) => {
  return (
    <div className="mt-6 p-6 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{meetup.title}</h4>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">{meetup.groupName}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(meetup.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{meetup.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{meetup.attendees} attending</span>
            </div>
          </div>
        </div>
        <button className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-2 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
          Join event
        </button>
      </div>
    </div>
  );
};

export default SelectedMeetupDetails;
