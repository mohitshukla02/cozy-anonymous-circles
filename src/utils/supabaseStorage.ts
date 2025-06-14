
import { supabase } from '@/integrations/supabase/client';
import { generateAnonymousName } from './groupStorage';

export interface Group {
  id: string;
  name: string;
  description: string;
  tags: string[];
  member_ids: string[];
  created_date: string;
  member_limit: number;
  privacy: 'open' | 'invitation';
  admin_id: string;
  type: 'interest' | 'local-meetup';
  location_city?: string;
  location_region?: string;
  location_lat?: number;
  location_lng?: number;
  status?: string;
  last_activity?: string;
  meetup_deadline?: string;
}

export interface Post {
  id: string;
  group_id: string;
  author_id: string;
  content: string;
  created_at: string;
  likes: string[];
  edited_at?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  parent_comment_id?: string;
  likes: string[];
}

export interface UserGroup {
  id: string;
  user_id: string;
  group_id: string;
  join_date: string;
  role: 'admin' | 'member';
  anonymous_name: string;
}

// Groups
export const getGroups = async (): Promise<Group[]> => {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .order('created_date', { ascending: false });

  if (error) {
    console.error('Error fetching groups:', error);
    return [];
  }

  return data.map(group => ({
    id: group.id,
    name: group.name,
    description: group.description,
    tags: group.tags || [],
    member_ids: group.member_ids || [],
    created_date: group.created_date,
    member_limit: group.member_limit,
    privacy: group.privacy,
    admin_id: group.admin_id,
    type: group.type,
    location_city: group.location_city,
    location_region: group.location_region,
    location_lat: group.location_lat,
    location_lng: group.location_lng,
    status: group.status,
    last_activity: group.last_activity,
    meetup_deadline: group.meetup_deadline
  }));
};

export const createGroup = async (groupData: Omit<Group, 'id' | 'created_date' | 'member_ids'>): Promise<Group | null> => {
  const { data, error } = await supabase
    .from('groups')
    .insert({
      name: groupData.name,
      description: groupData.description,
      tags: groupData.tags,
      member_ids: [groupData.admin_id],
      member_limit: groupData.member_limit,
      privacy: groupData.privacy,
      admin_id: groupData.admin_id,
      type: groupData.type,
      location_city: groupData.location_city,
      location_region: groupData.location_region,
      location_lat: groupData.location_lat,
      location_lng: groupData.location_lng
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating group:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    tags: data.tags || [],
    member_ids: data.member_ids || [],
    created_date: data.created_date,
    member_limit: data.member_limit,
    privacy: data.privacy,
    admin_id: data.admin_id,
    type: data.type,
    location_city: data.location_city,
    location_region: data.location_region,
    location_lat: data.location_lat,
    location_lng: data.location_lng,
    status: data.status,
    last_activity: data.last_activity,
    meetup_deadline: data.meetup_deadline
  };
};

export const joinGroup = async (groupId: string, userId: string): Promise<boolean> => {
  try {
    // First, update the group's member_ids array
    const { data: group } = await supabase
      .from('groups')
      .select('member_ids')
      .eq('id', groupId)
      .single();

    if (!group) return false;

    const updatedMemberIds = [...(group.member_ids || []), userId];

    const { error: groupError } = await supabase
      .from('groups')
      .update({ member_ids: updatedMemberIds })
      .eq('id', groupId);

    if (groupError) {
      console.error('Error updating group members:', groupError);
      return false;
    }

    // Then, create user_group record
    const anonymousName = generateAnonymousName(userId, groupId);
    
    const { error: userGroupError } = await supabase
      .from('user_groups')
      .insert({
        user_id: userId,
        group_id: groupId,
        role: 'member',
        anonymous_name: anonymousName
      });

    if (userGroupError) {
      console.error('Error creating user group:', userGroupError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error joining group:', error);
    return false;
  }
};

// User Groups
export const getUserGroups = async (userId: string): Promise<UserGroup[]> => {
  const { data, error } = await supabase
    .from('user_groups')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user groups:', error);
    return [];
  }

  return data || [];
};

// Posts
export const getPosts = async (groupId?: string): Promise<Post[]> => {
  let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
  
  if (groupId) {
    query = query.eq('group_id', groupId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data || [];
};

export const createPost = async (groupId: string, authorId: string, content: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      group_id: groupId,
      author_id: authorId,
      content
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    return null;
  }

  return data;
};

export const likePost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const { data: post } = await supabase
      .from('posts')
      .select('likes')
      .eq('id', postId)
      .single();

    if (!post) return false;

    const likes = post.likes || [];
    const updatedLikes = likes.includes(userId) 
      ? likes.filter((id: string) => id !== userId)
      : [...likes, userId];

    const { error } = await supabase
      .from('posts')
      .update({ likes: updatedLikes })
      .eq('id', postId);

    return !error;
  } catch (error) {
    console.error('Error liking post:', error);
    return false;
  }
};

// Comments
export const getComments = async (postId?: string): Promise<Comment[]> => {
  let query = supabase.from('comments').select('*').order('created_at', { ascending: true });
  
  if (postId) {
    query = query.eq('post_id', postId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data || [];
};

export const createComment = async (
  postId: string, 
  authorId: string, 
  content: string, 
  parentCommentId?: string
): Promise<Comment | null> => {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      author_id: authorId,
      content,
      parent_comment_id: parentCommentId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    return null;
  }

  return data;
};

export const likeComment = async (commentId: string, userId: string): Promise<boolean> => {
  try {
    const { data: comment } = await supabase
      .from('comments')
      .select('likes')
      .eq('id', commentId)
      .single();

    if (!comment) return false;

    const likes = comment.likes || [];
    const updatedLikes = likes.includes(userId) 
      ? likes.filter((id: string) => id !== userId)
      : [...likes, userId];

    const { error } = await supabase
      .from('comments')
      .update({ likes: updatedLikes })
      .eq('id', commentId);

    return !error;
  } catch (error) {
    console.error('Error liking comment:', error);
    return false;
  }
};
