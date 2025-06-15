
import React from 'react';
import { Button } from '../ui/button';
import { Group } from '../../types/groups';

interface FeedFiltersProps {
  showLocationFilter: boolean;
  groups: Group[];
  selectedLocation: string | null;
  onLocationChange: (location: string | null) => void;
}

const FeedFilters = ({ showLocationFilter, groups, selectedLocation, onLocationChange }: FeedFiltersProps) => {
  if (!showLocationFilter) return null;

  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Filter by Location</h3>
      <div className="flex flex-wrap gap-2">
        {Array.from(new Set(groups.map(g => g.locationCity).filter(Boolean))).map(city => (
          <Button
            key={city}
            variant={selectedLocation === city ? "default" : "outline"}
            size="sm"
            onClick={() => onLocationChange(selectedLocation === city ? null : city)}
            className="dark:border-gray-700 dark:text-gray-300"
          >
            {city}
          </Button>
        ))}
        {selectedLocation && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLocationChange(null)}
            className="dark:text-gray-400 dark:hover:text-gray-300"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default FeedFilters;
