
import React from 'react';
import { Plus } from 'lucide-react';

interface GroupsHeaderProps {
  onCreateGroup: () => void;
}

const GroupsHeader = ({ onCreateGroup }: GroupsHeaderProps) => {
  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-2">
            Discover Groups
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Find your community and connect with like-minded people</p>
        </div>
        <button
          onClick={onCreateGroup}
          className="mt-6 sm:mt-0 inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <Plus className="mr-2" size={20} />
          Create Group
        </button>
      </div>
    </div>
  );
};

export default GroupsHeader;
