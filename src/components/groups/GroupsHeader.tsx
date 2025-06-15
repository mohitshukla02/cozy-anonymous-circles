
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GroupsHeaderProps {
  onCreateGroup: () => void;
}

const GroupsHeader = ({ onCreateGroup }: GroupsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Discover Groups
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find your community and connect with like-minded people
        </p>
      </div>
      <Button 
        onClick={onCreateGroup}
        className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white"
      >
        <Plus size={20} className="mr-2" />
        Create Group
      </Button>
    </div>
  );
};

export default GroupsHeader;
