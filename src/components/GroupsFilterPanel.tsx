
import React, { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface GroupsFilterPanelProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  groupType: 'all' | 'interest' | 'local-meetup';
  setGroupType: (type: 'all' | 'interest' | 'local-meetup') => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search groups..."
              className="pl-10 pr-3 py-3 border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        {/* Group Type Toggle */}
        <div className="flex-shrink-0">
          <Tabs value={groupType} onValueChange={(value) => setGroupType(value as 'all' | 'interest' | 'local-meetup')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
              <TabsTrigger value="interest" className="text-sm">Global</TabsTrigger>
              <TabsTrigger value="local-meetup" className="text-sm">Local</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filter Button */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 px-4 py-3 h-auto"
            >
              <Filter size={18} />
              <span>Filters</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Filter Options</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X size={16} />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Tags
                  </label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="">All Tags</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTag('');
                    setIsFilterOpen(false);
                  }}
                  className="flex-1"
                >
                  Clear All
                </Button>
                <Button
                  onClick={() => setIsFilterOpen(false)}
                  size="sm"
                  className="flex-1"
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default GroupsFilterPanel;
