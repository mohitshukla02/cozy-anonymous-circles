
import React, { useState } from 'react';
import { Globe, MapPin } from 'lucide-react';
import { Group } from '@/types/groups';
import GroupsFilterPanel from '@/components/GroupsFilterPanel';
import GroupsSection from '@/components/GroupsSection';
import GroupDetailDialog from '@/components/GroupDetailDialog';
import LocationFilter from '@/components/LocationFilter';
import { useGroupsFilter } from '@/hooks/useGroupsFilter';

interface GroupsContentProps {
  groups: Group[];
  userTags: string[];
  userGroups: string[];
  onJoin: (groupId: string) => void;
  userLocation?: {
    city: string;
    region: string;
    coordinates?: { lat: number; lng: number };
  };
}

const GroupsContent = ({
  groups,
  userTags,
  userGroups,
  onJoin,
  userLocation
}: GroupsContentProps) => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showGroupDialog, setShowGroupDialog] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
    groupType,
    setGroupType,
    locationFilter,
    handleLocationChange,
    allTags,
    interestGroups,
    localGroups
  } = useGroupsFilter(groups);

  const handleViewGroup = (group: Group) => {
    setSelectedGroup(group);
    setShowGroupDialog(true);
  };

  const handleCloseGroupDialog = () => {
    setShowGroupDialog(false);
    setSelectedGroup(null);
  };

  return (
    <>
      {/* Location Filter */}
      <div className="mb-6">
        <LocationFilter
          selectedLocation={locationFilter}
          onLocationChange={handleLocationChange}
        />
      </div>

      {/* Filter Panel */}
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
          userTags={userTags}
          userGroups={userGroups}
          onJoin={onJoin}
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
          userTags={userTags}
          userGroups={userGroups}
          onJoin={onJoin}
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
          userTags={userTags}
          userGroups={userGroups}
          onJoin={onJoin}
          onViewGroup={handleViewGroup}
          showViewAll={groupType === 'all'}
          onViewAll={() => setGroupType('local-meetup')}
          emptyIcon={<MapPin size={48} className="mx-auto text-gray-400 mb-4" />}
          emptyMessage="No local meetup groups found matching your criteria."
          emptySubMessage="Try adjusting your filters or create a new meetup group!"
        />
      )}

      {/* Group Detail Dialog */}
      <GroupDetailDialog
        group={selectedGroup}
        isOpen={showGroupDialog}
        onClose={handleCloseGroupDialog}
        onJoin={onJoin}
        userTags={userTags}
        isJoined={selectedGroup ? userGroups.includes(selectedGroup.id) : false}
      />
    </>
  );
};

export default GroupsContent;
