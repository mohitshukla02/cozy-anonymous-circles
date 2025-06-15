
import { useState, useEffect } from 'react';
import { Group } from '@/types/groups';
import { getGroups, createGroup, getUserGroups, joinGroup } from '@/utils/supabaseStorage';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { generateRandomUsername } from '@/utils/usernameGenerator';
import { convertFeaturedGroupsToGroups } from '@/utils/groupUtils';

export const useGroupsData = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  return {
    groups,
    userGroups,
    loading: loading || profileLoading,
    profile,
    handleGroupCreated,
    handleJoinGroup
  };
};
