
import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Group } from '@/types/groups';
import { getGroups, createGroup, joinGroup, getUserGroups } from '../utils/supabaseStorage';
import GroupCard from '../components/GroupCard';
import CreateGroupModal from '../components/CreateGroupModal';
import { useToast } from '@/hooks/use-toast';

const Groups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'recommended' | 'my-groups' | 'all' | 'recent'>('recommended');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock user tags and location for now - these would come from user profile
  const userTags = ['photography', 'reading', 'hiking'];
  const userLocation = { city: 'San Francisco', region: 'California' };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      const [groupsData, userGroupsData] = await Promise.all([
        getGroups(),
        getUserGroups(user!.id)
      ]);
      
      setGroups(groupsData);
      setUserGroups(userGroupsData.map(ug => ug.group_id));
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load groups",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = groups;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'my-groups':
        filtered = filtered.filter(group => userGroups.includes(group.id));
        break;
      case 'recommended':
        if (userTags && userLocation) {
          // Prioritize local groups that match interests
          filtered = filtered.filter(group => {
            const matchingTags = group.tags.filter(tag => userTags.includes(tag));
            const isLocal = group.type === 'local-meetup' && 
              group.location_city && userLocation &&
              group.location_city.toLowerCase() === userLocation.city.toLowerCase();
            
            return matchingTags.length >= 2 || isLocal;
          });
          
          // Sort to prioritize local groups
          filtered.sort((a, b) => {
            const aIsLocal = a.type === 'local-meetup' && a.location_city && userLocation &&
              a.location_city.toLowerCase() === userLocation.city.toLowerCase();
            const bIsLocal = b.type === 'local-meetup' && b.location_city && userLocation &&
              b.location_city.toLowerCase() === userLocation.city.toLowerCase();
            
            if (aIsLocal && !bIsLocal) return -1;
            if (!aIsLocal && bIsLocal) return 1;
            
            // Then by tag matches
            const aMatches = a.tags.filter(tag => userTags.includes(tag)).length;
            const bMatches = b.tags.filter(tag => userTags.includes(tag)).length;
            return bMatches - aMatches;
          });
        }
        break;
      case 'recent':
        filtered = [...filtered].sort((a, b) => 
          new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
        );
        break;
      case 'all':
      default:
        // Show all groups
        break;
    }

    setFilteredGroups(filtered);
  }, [groups, searchTerm, activeFilter, userGroups, userTags, userLocation]);

  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;

    const group = groups.find(g => g.id === groupId);
    if (!group || userGroups.includes(groupId) || group.member_ids.length >= group.member_limit) {
      return;
    }

    try {
      const success = await joinGroup(groupId, user.id);
      if (success) {
        toast({
          title: "Success",
          description: `Joined ${group.name}!`,
        });
        await loadData(); // Refresh data
      } else {
        toast({
          title: "Error",
          description: "Failed to join group",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive"
      });
    }
  };

  const handleCreateGroup = async (groupData: {
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
    if (!user) return;

    try {
      const newGroup = await createGroup({
        name: groupData.name,
        description: groupData.description,
        tags: groupData.tags,
        member_limit: groupData.memberLimit,
        privacy: groupData.privacy,
        admin_id: user.id,
        type: groupData.type,
        location_city: groupData.location?.city,
        location_region: groupData.location?.region,
        location_lat: groupData.location?.coordinates?.lat,
        location_lng: groupData.location?.coordinates?.lng
      });

      if (newGroup) {
        toast({
          title: "Success",
          description: `Created ${newGroup.name}!`,
        });
        await loadData(); // Refresh data
      } else {
        toast({
          title: "Error",
          description: "Failed to create group",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive"
      });
    }
  };

  const filterButtons = [
    { key: 'recommended', label: 'Recommended', icon: Users },
    { key: 'my-groups', label: 'My Groups', icon: Users },
    { key: 'all', label: 'All Groups', icon: Users },
    { key: 'recent', label: 'Recently Active', icon: Users }
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 py-8">
      <div className="max-w-6xl mx-auto pt-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-800 mb-4">
            Interest Groups
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and join communities based on your hobbies, interests, and location. 
            Connect with like-minded people both online and in your city.
          </p>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search groups by name or description..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-amber-600 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            Create Group
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterButtons.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === key
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Location Info */}
        {userLocation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-center gap-2">
            <MapPin size={16} className="text-blue-600" />
            <span className="text-sm text-blue-800">
              Showing groups in and around {userLocation.city}, {userLocation.region}
            </span>
          </div>
        )}

        {/* Groups Grid */}
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-3xl p-8 shadow-soft max-w-md mx-auto">
              <Users size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-gray-800 mb-2">
                {activeFilter === 'my-groups' 
                  ? "You haven't joined any groups yet" 
                  : searchTerm 
                  ? "No groups found" 
                  : "No matching groups found"
                }
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {activeFilter === 'my-groups' 
                  ? "Join some groups to start connecting with like-minded people."
                  : searchTerm
                  ? "Try adjusting your search terms or browse all groups."
                  : !userLocation
                  ? "Set your location to see local meetup groups in your area."
                  : "Create a new group or adjust your interests to see more recommendations."
                }
              </p>
              {activeFilter !== 'my-groups' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-amber-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  Create Your First Group
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                userTags={userTags}
                onJoin={handleJoinGroup}
                isJoined={userGroups.includes(group.id)}
              />
            ))}
          </div>
        )}

        {/* Create Group Modal */}
        <CreateGroupModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateGroup}
          userTags={userTags}
          userLocation={userLocation}
        />
      </div>
    </div>
  );
};

export default Groups;
