
import React from 'react';
import { Search } from 'lucide-react';

interface GroupsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  groupType: 'all' | 'interest' | 'local-meetup';
  setGroupType: (type: 'all' | 'interest' | 'local-meetup') => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  cityFilter: string;
  setCityFilter: (city: string) => void;
  allTags: string[];
  allCities: string[];
}

const GroupsFilters = ({
  searchTerm,
  setSearchTerm,
  groupType,
  setGroupType,
  selectedTag,
  setSelectedTag,
  cityFilter,
  setCityFilter,
  allTags,
  allCities
}: GroupsFiltersProps) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search groups..."
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Group Type</label>
          <select
            value={groupType}
            onChange={(e) => setGroupType(e.target.value as 'all' | 'interest' | 'local-meetup')}
            className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          >
            <option value="all">All Groups</option>
            <option value="interest">Global Groups</option>
            <option value="local-meetup">Local Meetups</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Interest Tag</label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          >
            <option value="">All Cities</option>
            {allCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default GroupsFilters;
