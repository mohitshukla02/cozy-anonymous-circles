
import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Globe } from 'lucide-react';
import { Group } from '@/types/groups';
import { getGroups, createGroup, getUserGroups, joinGroup } from '@/utils/supabaseStorage';
import CreateGroupModal from '@/components/CreateGroupModal';
import GroupsFilterPanel from '@/components/GroupsFilterPanel';
import GroupsSection from '@/components/GroupsSection';
import GroupDetailDialog from '@/components/GroupDetailDialog';
import LocationFilter from '@/components/LocationFilter';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { generateRandomUsername } from '@/utils/usernameGenerator';
import { 
  convertFeaturedGroupsToGroups, 
  filterGroups, 
  getUniqueTagsAndCities, 
  separateGroupsByType 
} from '@/utils/groupUtils';

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [groupType, setGroupType] = useState<'all' | 'interest' | 'local-meetup'>('all');
  const [locationFilter, setLocationFilter] = useState('Hyderabad, India');
  
  const { profile, loading: profileLoading } = useUserProfile();
  const { user } = useAuth();

  useEffect(() => {
    loadGroups();
    if (user) {
      loadUserGroups();
    }
  }, [user]);

  const loadGroups = async () => {
    try {
      const dbGroups = await getGroups();
      const featuredGroups = convertFeaturedGroupsToGroups();
      setGroups([...featuredGroups, ...dbGroups]);
    } catch (error) {
      console.error('Error loading groups:', error);
      setGroups(convertFeaturedGroupsToGroups());
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

  const handleViewGroup = (group: Group) => {
    setSelectedGroup(group);
    setShowGroupDialog(true);
  };

  const handleCloseGroupDialog = () => {
    setShowGroupDialog(false);
    setSelectedGroup(null);
  };

  const handleLocationChange = (location: string) => {
    setLocationFilter(location);
  };

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

  const cityFilter = locationFilter ? locationFilter.split(',')[0].trim() : '';
  const filteredGroups = filterGroups(groups, searchTerm, selectedTag, groupType, cityFilter);
  const { allTags } = getUniqueTagsAndCities(groups);
  const { interestGroups, localGroups } = separateGroupsByType(filteredGroups);

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

          {/* Location Filter */}
          <div className="mb-6">
            <LocationFilter
              selectedLocation={locationFilter}
              onLocationChange={handleLocationChange}
            />
          </div>
        </div>

        {/* New Filter Panel */}
        <GroupsFilterPanel
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          groupType={groupType}
          setGroupType={setGroupType}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          allTags={allTags}
        />

        {/* Trending Groups */}
        {(groupType === 'all' || groupType === 'interest') && (
          <GroupsSection
            title="Trending Now"
            subtitle="Popular communities with active discussions"
            groups={interestGroups.slice(0, 6)}
            userTags={profile?.selected_tags || []}
            userGroups={userGroups}
            onJoin={handleJoinGroup}
            onViewGroup={handleViewGroup}
            showViewAll={groupType === 'all'}
            onViewAll={() => setGroupType('interest')}
            emptyIcon={<Globe size={48} className="mx-auto text-gray-400 mb-4" />}
            emptyMessage="No trending groups found matching your criteria."
            emptySubMessage="Try adjusting your filters or create a new community!"
          />
        )}

        {/* Suggested Groups */}
        {(groupType === 'all' || groupType === 'interest') && interestGroups.length > 6 && (
          <GroupsSection
            title="Based on Your Interests"
            subtitle="Communities that match your selected interests and preferences"
            groups={interestGroups.slice(6)}
            userTags={profile?.selected_tags || []}
            userGroups={userGroups}
            onJoin={handleJoinGroup}
            onViewGroup={handleViewGroup}
            emptyIcon={<Globe size={48} className="mx-auto text-gray-400 mb-4" />}
            emptyMessage="No suggested groups found."
            emptySubMessage="Update your interests in your profile to get better recommendations!"
          />
        )}

        {/* Local Meetup Groups */}
        {(groupType === 'all' || groupType === 'local-meetup') && (
          <GroupsSection
            title="Local Meetups"
            subtitle="Meet people in your city for real-world activities and events"
            groups={localGroups}
            userTags={profile?.selected_tags || []}
            userGroups={userGroups}
            onJoin={handleJoinGroup}
            onViewGroup={handleViewGroup}
            showViewAll={groupType === 'all'}
            onViewAll={() => setGroupType('local-meetup')}
            emptyIcon={<MapPin size={48} className="mx-auto text-gray-400 mb-4" />}
            emptyMessage="No local meetup groups found matching your criteria."
            emptySubMessage="Try adjusting your filters or create a new meetup group!"
          />
        )}

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

        {/* Group Detail Dialog */}
        <GroupDetailDialog
          group={selectedGroup}
          isOpen={showGroupDialog}
          onClose={handleCloseGroupDialog}
          onJoin={handleJoinGroup}
          userTags={profile?.selected_tags || []}
          isJoined={selectedGroup ? userGroups.includes(selectedGroup.id) : false}
        />
      </div>
    </div>
  );
};

export default Groups;
