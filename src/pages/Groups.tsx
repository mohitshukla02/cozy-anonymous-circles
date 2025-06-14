
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Users, Clock, Search, Filter } from 'lucide-react';
import { Group } from '@/types/groups';
import { getGroups, createGroup } from '@/utils/supabaseStorage';
import { formatDistanceToNow } from 'date-fns';
import CreateGroupModal from '@/components/CreateGroupModal';
import GroupCard from '@/components/GroupCard';
import { useUserProfile } from '@/hooks/useUserProfile';

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [groupType, setGroupType] = useState<'all' | 'interest' | 'local-meetup'>('all');
  const [cityFilter, setCityFilter] = useState('');
  
  const { profile, loading: profileLoading } = useUserProfile();

  console.log('User profile in Groups:', profile);
  console.log('User tags:', profile?.selected_tags);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const allGroups = await getGroups();
      setGroups(allGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupCreated = async (groupData: {
    name: string;
    description: string;
    tags: string[];
    memberLimit: number;
    privacy: 'open' | 'invitation';
    type: 'interest' | 'local-meetup';
    location?: {
      city: string;
      region: string;
      coordinates?: { lat: number; lng: number };
    };
  }) => {
    try {
      const newGroup = await createGroup({
        name: groupData.name,
        description: groupData.description,
        tags: groupData.tags,
        memberLimit: groupData.memberLimit,
        privacy: groupData.privacy,
        adminId: '', // This will be set by the createGroup function
        type: groupData.type,
        locationCity: groupData.location?.city,
        locationRegion: groupData.location?.region,
        lastMeetupDate: undefined,
        meetupDeadline: undefined
      });
      
      setGroups(prev => [newGroup, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  // Filter groups based on search and filters
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = !selectedTag || group.tags.includes(selectedTag);
    const matchesType = groupType === 'all' || group.type === groupType;
    const matchesCity = !cityFilter || 
      (group.locationCity && group.locationCity.toLowerCase().includes(cityFilter.toLowerCase()));

    return matchesSearch && matchesTag && matchesType && matchesCity;
  });

  // Get unique tags and cities for filters
  const allTags = [...new Set(groups.flatMap(group => group.tags))];
  const allCities = [...new Set(groups.map(group => group.locationCity).filter(Boolean))];

  // Separate groups by type
  const interestGroups = filteredGroups.filter(group => group.type === 'interest');
  const localGroups = filteredGroups.filter(group => group.type === 'local-meetup');

  if (loading || profileLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Discover Groups</h1>
          <p className="text-gray-600">Find your community and connect with like-minded people</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 shadow-sm"
        >
          <Plus size={18} />
          <span>Create Group</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
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
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={groupType}
              onChange={(e) => setGroupType(e.target.value as 'all' | 'interest' | 'local-meetup')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Groups</option>
              <option value="interest">Interest Groups</option>
              <option value="local-meetup">Local Meetups</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">All Cities</option>
              {allCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Groups Display */}
      {groupType === 'all' || groupType === 'interest' ? (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Interest Groups</h2>
          {interestGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interestGroups.map(group => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No interest groups found matching your criteria.</p>
            </div>
          )}
        </div>
      ) : null}

      {groupType === 'all' || groupType === 'local-meetup' ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Local Meetup Groups</h2>
          {localGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localGroups.map(group => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No local meetup groups found matching your criteria.</p>
            </div>
          )}
        </div>
      ) : null}

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleGroupCreated}
          userTags={profile?.selected_tags || []}
          userLocation={profile?.location_city && profile?.location_region ? {
            city: profile.location_city,
            region: profile.location_region,
            coordinates: profile.location_coordinates
          } : undefined}
        />
      )}
    </div>
  );
};

export default Groups;
