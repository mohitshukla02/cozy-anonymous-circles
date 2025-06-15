
import React from 'react';
import { Button } from '../ui/button';

interface MeetupFormActionsProps {
  onCancel: () => void;
  isLoading: boolean;
}

const MeetupFormActions = ({ onCancel, isLoading }: MeetupFormActionsProps) => {
  return (
    <div className="flex gap-3 pt-4">
      <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading} className="flex-1">
        {isLoading ? 'Creating...' : 'Create Meetup'}
      </Button>
    </div>
  );
};

export default MeetupFormActions;
