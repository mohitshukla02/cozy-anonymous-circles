
import { supabase } from '@/integrations/supabase/client';
import { Group, Post, Comment, UserGroup } from '../types/groups';
import { generateAnonymousName } from './groupStorage';

// Convert database group to frontend format
const convertDbGroupToFrontend = (dbGroup: any): Group => ({
  id: dbGroup.id,
  name: dbGroup.name,
  description: dbGroup.description,
  tags: dbGroup.tags || [],
  memberIds: dbGroup.member_ids || [],
  createdDate: dbGroup.created_date,
  memberLimit: dbGroup.member_limit,
  privacy: dbGroup.privacy as 'open' | 'invitation',
  adminId: dbGroup.admin_id,
  avatar: dbGroup.avatar,
  pinnedPostId: dbGroup.pinned_post_id,
  type: dbGroup.type as 'interest' | 'local-meetup',
  location: dbGroup.location_city ? {
    city: dbGroup.location_city,
    region: dbGroup.location_region,
    coordinates: dbGroup.location_lat && dbGroup.location_lng ? {
      lat: dbGroup.location_lat,
      lng: dbGroup.location_lng
    } : undefined
  } : undefined
});

// Get groups from Supabase
export const getGroupsFromSupabase = async (): Promise<Group[]> => {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('privacy', 'open')
    .order('created_date', { ascending: false });

  if (error) {
    console.error('Error fetching groups:', error);
    return [];
  }

  return data?.map(convertDbGroupToFrontend) || [];
};

// Create group in Supabase
export const createGroupInSupabase = async (group: Omit<Group, 'id' | 'createdDate'>): Promise<boolean> => {
  const { error } = await supabase
    .from('groups')
    .insert({
      name: group.name,
      description: group.description,
      tags: group.tags,
      member_ids: group.memberIds,
      member_limit: group.memberLimit,
      privacy: group.privacy,
      admin_id: group.adminId,
      avatar: group.avatar,
      pinned_post_id: group.pinnedPostId,
      type: group.type,
      location_city: group.location?.city,
      location_region: group.location?.region,
      location_lat: group.location?.coordinates?.lat,
      location_lng: group.location?.coordinates?.lng
    });

  if (error) {
    console.error('Error creating group:', error);
    return false;
  }

  return true;
};

// Join group in Supabase
export const joinGroupInSupabase = async (groupId: string, userId: string): Promise<boolean> => {
  const anonymousName = generateAnonymousName(userId, groupId);
  
  const { error } = await supabase
    .from('user_groups')
    .insert({
      user_id: userId,
      group_id: groupId,
      role: 'member',
      anonymous_name: anonymousName
    });

  if (error) {
    console.error('Error joining group:', error);
    return false;
  }

  // Update group member count
  const { data: group } = await supabase
    .from('groups')
    .select('member_ids')
    .eq('id', groupId)
    .single();

  if (group) {
    const updatedMemberIds = [...(group.member_ids || []), userId];
    await supabase
      .from('groups')
      .update({ member_ids: updatedMemberIds })
      .eq('id', groupId);
  }

  return true;
};

// Get user's groups from Supabase
export const getUserGroupsFromSupabase = async (userId: string): Promise<UserGroup[]> => {
  const { data, error } = await supabase
    .from('user_groups')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user groups:', error);
    return [];
  }

  return data?.map(ug => ({
    userId: ug.user_id,
    groupId: ug.group_id,
    joinDate: ug.join_date,
    role: ug.role as 'admin' | 'member',
    anonymousName: ug.anonymous_name
  })) || [];
};
