
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Users, Clock, Search, Filter, Sparkles, Globe } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-16 bg-white/60 rounded-xl"></div>
            <div className="h-32 bg-white/60 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/60 h-40 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with enhanced styling */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/40">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent mb-2">
                Discover Groups
              </h1>
              <p className="text-gray-600">Find your community and connect with like-minded people</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-6 sm:mt-0 group relative bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Plus size={20} className="relative z-10" />
            <span className="relative z-10 font-medium">Create Group</span>
            <Sparkles size={16} className="relative z-10 opacity-80" />
          </button>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-10"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/60 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="text-purple-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">Filter Groups</h3>
            </div>
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
                    className="w-full pl-10 pr-3 py-3 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Group Type</label>
                <div className="relative">
                  <select
                    value={groupType}
                    onChange={(e) => setGroupType(e.target.value as 'all' | 'interest' | 'local-meetup')}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer transition-all"
                  >
                    <option value="all">All Groups</option>
                    <option value="interest">Interest Communities</option>
                    <option value="local-meetup">Local Meetups</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Tag</label>
                <div className="relative">
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer transition-all"
                  >
                    <option value="">All Tags</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <div className="relative">
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer transition-all"
                  >
                    <option value="">All Cities</option>
                    {allCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Groups Display */}
        {groupType === 'all' || groupType === 'interest' ? (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Globe className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Interest Communities</h2>
                <p className="text-sm text-gray-600">Global discussions around shared interests and hobbies</p>
              </div>
            </div>
            {interestGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interestGroups.map(group => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40">
                <Globe size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No interest communities found matching your criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or create a new community!</p>
              </div>
            )}
          </div>
        ) : null}

        {groupType === 'all' || groupType === 'local-meetup' ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <MapPin className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Local Meetup Groups</h2>
                <p className="text-sm text-gray-600">Meet people in your city for real-world activities and events</p>
              </div>
            </div>
            {localGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localGroups.map(group => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40">
                <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No local meetup groups found matching your criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or create a new meetup group!</p>
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
    </div>
  );
};

export default Groups;
