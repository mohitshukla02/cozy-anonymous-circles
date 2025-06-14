
import { Group } from '@/types/groups';
import { featuredGroups } from '@/data/featuredGroups';

export const convertFeaturedGroupsToGroups = (): Group[] => {
  return featuredGroups.map(group => ({
    id: group.id,
    name: group.name,
    description: group.description,
    tags: group.tags,
    memberIds: Array.from({ length: group.members }, (_, i) => `user-${i}`),
    createdDate: new Date().toISOString(),
    memberLimit: 500,
    privacy: 'open' as const,
    adminId: 'admin-1',
    type: group.type,
    locationCity: group.locationCity,
    locationRegion: group.locationRegion,
    isArchived: false,
    image: group.image
  }));
};

export const filterGroups = (
  groups: Group[],
  searchTerm: string,
  selectedTag: string,
  groupType: 'all' | 'interest' | 'local-meetup',
  cityFilter: string
) => {
  return groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = !selectedTag || group.tags.includes(selectedTag);
    const matchesType = groupType === 'all' || group.type === groupType;
    const matchesCity = !cityFilter || 
      (group.locationCity && group.locationCity.toLowerCase().includes(cityFilter.toLowerCase()));

    return matchesSearch && matchesTag && matchesType && matchesCity;
  });
};

export const getUniqueTagsAndCities = (groups: Group[]) => {
  const allTags = [...new Set(groups.flatMap(group => group.tags))];
  const allCities = [...new Set(groups.map(group => group.locationCity).filter(Boolean))];
  
  return { allTags, allCities };
};

export const separateGroupsByType = (groups: Group[]) => {
  const interestGroups = groups.filter(group => group.type === 'interest');
  const localGroups = groups.filter(group => group.type === 'local-meetup');
  
  return { interestGroups, localGroups };
};
