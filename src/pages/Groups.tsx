import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Users, Clock, Search, Filter, Sparkles, Globe, ArrowRight } from 'lucide-react';
import { Group } from '@/types/groups';
import { getGroups, createGroup, getUserGroups, joinGroup } from '@/utils/supabaseStorage';
import { formatDistanceToNow } from 'date-fns';
import CreateGroupModal from '@/components/CreateGroupModal';
import GroupCard from '@/components/GroupCard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { generateRandomUsername } from '@/utils/usernameGenerator';

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

  // Featured groups from Dashboard with images
  const featuredGroups = [
    {
      id: 'featured-1',
      name: "Local Photographers",
      description: "Capturing moments around the city",
      members: 127,
      category: "Creative Arts",
      isLocal: true,
      trending: true,
      image: "/lovable-uploads/512e664e-f0ea-41a9-8dcf-c6d80845a703.png",
      tags: ["photography", "creative", "arts"],
      type: "local-meetup" as const,
      locationCity: "Hyderabad",
      locationRegion: "Telangana"
    },
    {
      id: 'featured-2',
      name: "Weekend Hikers",
      description: "Exploring trails every Saturday",
      members: 89,
      category: "Sports & Outdoors",
      isLocal: true,
      trending: false,
      image: "/lovable-uploads/6e18371c-1606-4423-a38e-e1ca52624fa8.png",
      tags: ["hiking", "outdoor", "fitness"],
      type: "local-meetup" as const,
      locationCity: "Hyderabad",
      locationRegion: "Telangana"
    },
    {
      id: 'featured-3',
      name: "Book Club Enthusiasts",
      description: "Monthly discussions on great reads",
      members: 156,
      category: "Intellectual",
      isLocal: false,
      trending: true,
      image: "/lovable-uploads/d9cd9dda-8dd7-4348-adce-1fd23806b825.png",
      tags: ["books", "reading", "discussion"],
      type: "interest" as const
    },
    {
      id: 'featured-4',
      name: "Chai & Conversations",
      description: "Weekly meetups at local cafes",
      members: 203,
      category: "Lifestyle",
      isLocal: true,
      trending: false,
      image: "/lovable-uploads/f1943dbb-6789-48c9-bb11-8214c2c246b7.png",
      tags: ["social", "lifestyle", "networking"],
      type: "local-meetup" as const,
      locationCity: "Hyderabad",
      locationRegion: "Telangana"
    },
    // New groups with images
    {
      id: 'featured-5',
      name: "Startup Founders",
      description: "Building the future together",
      members: 84,
      category: "Business",
      isLocal: false,
      trending: true,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
      tags: ["startup", "business", "entrepreneurship"],
      type: "interest" as const
    },
    {
      id: 'featured-6',
      name: "Robotics Enthusiasts",
      description: "Building and programming robots",
      members: 67,
      category: "Technology",
      isLocal: false,
      trending: false,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
      tags: ["robotics", "technology", "programming"],
      type: "interest" as const
    },
    {
      id: 'featured-7',
      name: "Urban Gardeners",
      description: "Growing green spaces in the city",
      members: 142,
      category: "Lifestyle",
      isLocal: true,
      trending: false,
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop",
      tags: ["gardening", "sustainability", "plants"],
      type: "local-meetup" as const,
      locationCity: "Hyderabad",
      locationRegion: "Telangana"
    },
    {
      id: 'featured-8',
      name: "Golden Years Circle",
      description: "Active community for seniors",
      members: 95,
      category: "Community",
      isLocal: true,
      trending: false,
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=300&fit=crop",
      tags: ["seniors", "community", "activities"],
      type: "local-meetup" as const,
      locationCity: "Hyderabad",
      locationRegion: "Telangana"
    },
    {
      id: 'featured-9',
      name: "Literary Society",
      description: "Writers and literature lovers unite",
      members: 118,
      category: "Arts & Culture",
      isLocal: false,
      trending: true,
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop",
      tags: ["writing", "literature", "poetry"],
      type: "interest" as const
    },
    {
      id: 'featured-10',
      name: "Jam Session Collective",
      description: "Musicians jamming together",
      members: 76,
      category: "Music",
      isLocal: true,
      trending: false,
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
      tags: ["music", "jamming", "instruments"],
      type: "local-meetup" as const,
      locationCity: "Hyderabad",
      locationRegion: "Telangana"
    }
  ];

  // Convert featured groups to Group format with images
  const convertedFeaturedGroups: Group[] = featuredGroups.map(group => ({
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

  useEffect(() => {
    loadGroups();
    if (user) {
      loadUserGroups();
    }
  }, [user]);

  const loadGroups = async () => {
    try {
      const dbGroups = await getGroups();
      // Combine DB groups with featured groups
      setGroups([...convertedFeaturedGroups, ...dbGroups]);
    } catch (error) {
      console.error('Error loading groups:', error);
      // Fallback to just featured groups if DB fails
      setGroups(convertedFeaturedGroups);
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
        adminId: '',
        type: groupData.type,
        locationCity: groupData.location?.city,
        locationRegion: groupData.location?.region,
        lastMeetupDate: undefined,
        meetupDeadline: undefined
      });
      
      setGroups(prev => [newGroup, ...prev]);
      setShowCreateModal(false);
      loadUserGroups();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      const anonymousName = generateRandomUsername();
      await joinGroup(groupId, anonymousName);
      
      setUserGroups(prev => [...prev, groupId]);
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
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <div className="animate-pulse space-y-6">
            <div className="h-16 bg-gray-100 rounded-xl"></div>
            <div className="h-32 bg-gray-100 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-100 h-64 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-medium text-gray-900 mb-2">
                Discover Groups
              </h1>
              <p className="text-gray-600">Find your community and connect with like-minded people</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 sm:mt-0 inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <Plus className="mr-2" size={20} />
              Create Group
            </button>
          </div>
        </div>

        {/* Search and Filters */}
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

        {/* Global Groups */}
        {groupType === 'all' || groupType === 'interest' ? (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-1">Global Communities</h2>
                <p className="text-gray-600 text-sm">Online discussions around shared interests and hobbies</p>
              </div>
              {groupType === 'all' && (
                <button
                  onClick={() => setGroupType('interest')}
                  className="text-gray-900 font-medium hover:underline flex items-center text-sm"
                >
                  Show all
                  <ArrowRight className="ml-1" size={16} />
                </button>
              )}
            </div>
            
            {interestGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-1">Local Meetups</h2>
                <p className="text-gray-600 text-sm">Meet people in your city for real-world activities and events</p>
              </div>
              {groupType === 'all' && (
                <button
                  onClick={() => setGroupType('local-meetup')}
                  className="text-gray-900 font-medium hover:underline flex items-center text-sm"
                >
                  Show all
                  <ArrowRight className="ml-1" size={16} />
                </button>
              )}
            </div>
            
            {localGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
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
