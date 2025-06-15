
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface GroupsFilterPanelProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  groupType: 'all' | 'interest' | 'local-meetup';
  setGroupType: (type: 'all' | 'interest' | 'local-meetup') => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  allTags: string[];
}

const GroupsFilterPanel = ({
  searchTerm,
  setSearchTerm,
  groupType,
  setGroupType,
  selectedTag,
  setSelectedTag,
  allTags
}: GroupsFilterPanelProps) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Group Type Filter */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <Button
            variant={groupType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGroupType('all')}
            className="flex-1 text-xs dark:text-gray-300 dark:border-gray-600"
          >
            All
          </Button>
          <Button
            variant={groupType === 'interest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGroupType('interest')}
            className="flex-1 text-xs dark:text-gray-300 dark:border-gray-600"
          >
            Global
          </Button>
          <Button
            variant={groupType === 'local-meetup' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGroupType('local-meetup')}
            className="flex-1 text-xs dark:text-gray-300 dark:border-gray-600"
          >
            Local
          </Button>
        </div>

        {/* Filters Button */}
        <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
          <Filter size={16} className="mr-2" />
          Filters
        </Button>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by interests:</p>
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 10).map(tag => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedTag === tag 
                    ? "bg-primary text-primary-foreground" 
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
            {selectedTag && (
              <Badge
                variant="outline"
                className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-gray-300 dark:border-gray-600"
                onClick={() => setSelectedTag(null)}
              >
                Clear
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsFilterPanel;
