
import React from 'react';
import { Filter, MapPin } from 'lucide-react';
import { Button } from '../ui/button';

interface FeedHeaderProps {
  onToggleLocationFilter: () => void;
  onToggleFilters: () => void;
}

const FeedHeader = ({ onToggleLocationFilter, onToggleFilters }: FeedHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Your Feed</h1>
        <p className="text-gray-600 dark:text-gray-400">Stay connected with your groups and communities</p>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleLocationFilter}
          className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <MapPin size={16} className="mr-2" />
          Location
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Filter size={16} className="mr-2" />
          Filters
        </Button>
      </div>
    </div>
  );
};

export default FeedHeader;
