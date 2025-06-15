
import { useState } from 'react';
import { Group } from '@/types/groups';
import { filterGroups, getUniqueTagsAndCities, separateGroupsByType } from '@/utils/groupUtils';

export const useGroupsFilter = (groups: Group[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [groupType, setGroupType] = useState<'all' | 'interest' | 'local-meetup'>('all');
  const [locationFilter, setLocationFilter] = useState('Hyderabad, India');

  const handleLocationChange = (location: string) => {
    setLocationFilter(location);
  };

  const cityFilter = locationFilter ? locationFilter.split(',')[0].trim() : '';
  const filteredGroups = filterGroups(groups, searchTerm, selectedTag, groupType, cityFilter);
  const { allTags } = getUniqueTagsAndCities(groups);
  const { interestGroups, localGroups } = separateGroupsByType(filteredGroups);

  return {
    searchTerm,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
    groupType,
    setGroupType,
    locationFilter,
    handleLocationChange,
    filteredGroups,
    allTags,
    interestGroups,
    localGroups
  };
};
