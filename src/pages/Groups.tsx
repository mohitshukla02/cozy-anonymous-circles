
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Users, Clock, Search, Filter, Sparkles, Globe } from 'lucide-react';
import { Group } from '@/types/groups';
import { getGroups, createGroup, getUserGroups, joinGroup } from '@/utils/supabaseStorage';
import { formatDistanceToNow } from 'date-fns';
import CreateGroupModal from '@/components/CreateGroupModal';
import GroupCard from '@/components/GroupCard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { generateUsername } from '@/utils/usernameGenerator';

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [groupType, setGroupType] = useState<'all' | 'interest' | 'local-meetup'>('all');
  const [cityFilter, setCityFilter] = useState('');
  
  const { profile, loading: profileLoading } = useUserProfile();
  const { user } = useAuth();

  console.log('User profile in Groups:', profile);
  console.log('User tags:', profile?.selected_tags);

  useEffect(() => {
    loadGroups();
    if (user) {
      loadUserGroups();
    }
  }, [user]);

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

  const loadUserGroups = async () => {
    if (!user) return;
    try {
      const userGroupsData = await getUserGroups(user.id);
      setUserGroups(userGroupsData.map(ug => ug.groupId));
    } catch (error) {
      console.error('Error loading user groups:', error);
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
      // Reload user groups since the user automatically joins their created group
      loadUserGroups();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      const anonymousName = generateUsername();
      await joinGroup(groupId, anonymousName);
      
      // Update local state
      setUserGroups(prev => [...prev, groupId]);
      
      // Reload groups to get updated member count
      loadGroups();
    } catch (error) {
      console.error('Error joining group:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-8">
          <div className="animate-pulse space-y-6">
            <div className="h-16 bg-white/80 rounded-xl shadow-sm"></div>
            <div className="h-32 bg-white/80 rounded-xl shadow-sm"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/80 h-40 rounded-xl shadow-sm"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
              Discover Groups
            </h1>
            <p className="text-gray-600">Find your community and connect with like-minded people</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-6 sm:mt-0 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            <span className="font-medium">Create Group</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Filter className="text-white" size={20} />
            </div>
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
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group Type</label>
              <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value as 'all' | 'interest' | 'local-meetup')}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
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
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
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
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
              >
                <option value="">All Cities</option>
                {allCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Global Groups */}
        {groupType === 'all' || groupType === 'interest' ? (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Globe className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-gray-900">Global Groups</h2>
                <p className="text-sm text-gray-600">Online discussions around shared interests and hobbies</p>
              </div>
            </div>
            {interestGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interestGroups.map(group => (
                  <GroupCard 
                    key={group.id} 
                    group={group} 
                    userTags={profile?.selected_tags || []}
                    onJoin={handleJoinGroup}
                    isJoined={userGroups.includes(group.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                <Globe size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No global groups found matching your criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or create a new community!</p>
              </div>
            )}
          </div>
        ) : null}

        {/* Local Meetup Groups */}
        {groupType === 'all' || groupType === 'local-meetup' ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <MapPin className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-gray-900">Local Meetup Groups</h2>
                <p className="text-sm text-gray-600">Meet people in your city for real-world activities and events</p>
              </div>
            </div>
            {localGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localGroups.map(group => (
                  <GroupCard 
                    key={group.id} 
                    group={group} 
                    userTags={profile?.selected_tags || []}
                    onJoin={handleJoinGroup}
                    isJoined={userGroups.includes(group.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
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
