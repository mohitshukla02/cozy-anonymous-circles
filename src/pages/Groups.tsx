
import React, { useState } from 'react';
import CreateGroupModal from '@/components/CreateGroupModal';
import GroupsHeader from '@/components/groups/GroupsHeader';
import GroupsContent from '@/components/groups/GroupsContent';
import GroupsLoadingState from '@/components/groups/GroupsLoadingState';
import { useGroupsData } from '@/hooks/useGroupsData';

const Groups = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const {
    groups,
    userGroups,
    loading,
    profile,
    handleGroupCreated,
    handleJoinGroup
  } = useGroupsData();

  const handleGroupCreatedAndClose = async (groupData: {
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
    await handleGroupCreated(groupData);
    setShowCreateModal(false);
  };

  if (loading) {
    return <GroupsLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/30 to-gray-100/30 dark:bg-gradient-dark pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <GroupsHeader onCreateGroup={() => setShowCreateModal(true)} />

        <GroupsContent
          groups={groups}
          userTags={profile?.selected_tags || []}
          userGroups={userGroups}
          onJoin={handleJoinGroup}
          userLocation={profile?.location_city && profile?.location_region ? {
            city: profile.location_city,
            region: profile.location_region,
            coordinates: profile.location_coordinates
          } : undefined}
        />

        {/* Create Group Modal */}
        {showCreateModal && (
          <CreateGroupModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleGroupCreatedAndClose}
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
