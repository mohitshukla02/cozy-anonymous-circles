import { supabase } from '@/integrations/supabase/client';
import { Group, Post, Comment, UserGroup } from '@/types/groups';

// Group operations
export const getGroups = async (): Promise<Group[]> => {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('status', 'active');
  
  if (error) throw error;
  
  return data.map(group => ({
    id: group.id,
    name: group.name,
    description: group.description,
    tags: group.tags || [],
    memberIds: group.member_ids || [],
    createdDate: group.created_date,
    memberLimit: group.member_limit,
    privacy: group.privacy as 'open' | 'invitation',
    adminId: group.admin_id,
    type: group.type as 'interest' | 'local-meetup',
    locationCity: group.location_city,
    locationRegion: group.location_region,
    isArchived: group.status === 'archived',
    lastMeetupDate: group.last_activity,
    meetupDeadline: group.meetup_deadline
  }));
};

export const getGroupById = async (groupId: string): Promise<Group | null> => {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', groupId)
    .single();
  
  if (error) throw error;
  if (!data) return null;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    tags: data.tags || [],
    memberIds: data.member_ids || [],
    createdDate: data.created_date,
    memberLimit: data.member_limit,
    privacy: data.privacy as 'open' | 'invitation',
    adminId: data.admin_id,
    type: data.type as 'interest' | 'local-meetup',
    locationCity: data.location_city,
    locationRegion: data.location_region,
    isArchived: data.status === 'archived',
    lastMeetupDate: data.last_activity,
    meetupDeadline: data.meetup_deadline
  };
};

// Improved sanitizeInput
function sanitizeInput(content: string): string {
  // Remove HTML tags, script tags, and potentially dangerous content
  let clean = content
    // Remove script tags and content between them
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    // Remove all other HTML tags
    .replace(/<\/?[^>]+(>|$)/g, "")
    // Remove inline JS events
    .replace(/on\w+=".*?"/gi, "")
    // Remove non-printable characters
    .replace(/[^\x20-\x7E\r\n]+/g, "");
  clean = clean.substring(0, 500);
  return clean.trim();
}

export const createGroup = async (group: Omit<Group, 'id' | 'createdDate' | 'memberIds' | 'isArchived'>): Promise<Group> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Sanitize text fields
  const name = sanitizeInput(group.name);
  const description = sanitizeInput(group.description);
  // (tags allowed as-is since they're picked, not free-form user text)
  const locationCity = group.locationCity ? sanitizeInput(group.locationCity) : undefined;
  const locationRegion = group.locationRegion ? sanitizeInput(group.locationRegion) : undefined;

  if (!name) throw new Error('Group name cannot be empty.');
  if (!description) throw new Error('Group description cannot be empty.');

  const { data, error } = await supabase
    .from('groups')
    .insert([{
      name,
      description,
      tags: group.tags,
      member_ids: [user.id],
      member_limit: group.memberLimit,
      privacy: group.privacy,
      admin_id: user.id,
      type: group.type,
      location_city: locationCity,
      location_region: locationRegion,
      status: 'active'
    }])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    tags: data.tags || [],
    memberIds: data.member_ids || [],
    createdDate: data.created_date,
    memberLimit: data.member_limit,
    privacy: data.privacy as 'open' | 'invitation',
    adminId: data.admin_id,
    type: data.type as 'interest' | 'local-meetup',
    locationCity: data.location_city,
    locationRegion: data.location_region,
    isArchived: data.status === 'archived',
    lastMeetupDate: data.last_activity,
    meetupDeadline: data.meetup_deadline
  };
};

// User Groups operations
export const getUserGroups = async (userId: string): Promise<UserGroup[]> => {
  const { data, error } = await supabase
    .from('user_groups')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  
  return data.map(userGroup => ({
    id: userGroup.id,
    userId: userGroup.user_id,
    groupId: userGroup.group_id,
    role: userGroup.role as 'admin' | 'member',
    joinDate: userGroup.join_date,
    anonymousName: userGroup.anonymous_name
  }));
};

export const joinGroup = async (groupId: string, anonymousName: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('user_groups')
    .insert([{
      user_id: user.id,
      group_id: groupId,
      role: 'member',
      anonymous_name: anonymousName
    }]);

  if (error) throw error;

  // Update group member count by adding user ID to member_ids array
  const { data: group } = await supabase
    .from('groups')
    .select('member_ids')
    .eq('id', groupId)
    .single();

  if (group) {
    const updatedMemberIds = [...(group.member_ids || []), user.id];
    await supabase
      .from('groups')
      .update({ member_ids: updatedMemberIds })
      .eq('id', groupId);
  }
};

// Posts operations
export const getPostsByGroup = async (groupId: string): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Count comments for each post
  const postsWithCommentCount = await Promise.all(
    data.map(async (post) => {
      const { count } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);
      
      return {
        id: post.id,
        authorId: post.author_id,
        groupId: post.group_id,
        content: post.content,
        createdAt: post.created_at,
        editedAt: post.edited_at,
        likes: post.likes || [],
        commentCount: count || 0
      };
    })
  );
  
  return postsWithCommentCount;
};

export const createPost = async (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'commentCount'>): Promise<Post> => {
  const sanitizedContent = sanitizeInput(post.content);
  if (!sanitizedContent) throw new Error('Post content cannot be empty.');

  const { data, error } = await supabase
    .from('posts')
    .insert([{
      author_id: post.authorId,
      group_id: post.groupId,
      content: sanitizedContent,
      likes: []
    }])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    authorId: data.author_id,
    groupId: data.group_id,
    content: data.content,
    createdAt: data.created_at,
    editedAt: data.edited_at,
    likes: data.likes || [],
    commentCount: 0
  };
};

// Comments operations
export const getCommentsByPost = async (postId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  
  return data.map(comment => ({
    id: comment.id,
    postId: comment.post_id,
    authorId: comment.author_id,
    content: comment.content,
    createdAt: comment.created_at,
    likes: comment.likes || []
  }));
};

export const createComment = async (comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>): Promise<Comment> => {
  const sanitizedContent = sanitizeInput(comment.content);
  if (!sanitizedContent) throw new Error('Comment content cannot be empty.');

  const { data, error } = await supabase
    .from('comments')
    .insert([{
      post_id: comment.postId,
      author_id: comment.authorId,
      content: sanitizedContent,
      likes: []
    }])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    postId: data.post_id,
    authorId: data.author_id,
    content: data.content,
    createdAt: data.created_at,
    likes: data.likes || []
  };
};

export const likePost = async (postId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get current post likes
  const { data: post } = await supabase
    .from('posts')
    .select('likes')
    .eq('id', postId)
    .single();

  if (post) {
    const currentLikes = post.likes || [];
    const isLiked = currentLikes.includes(user.id);
    
    const updatedLikes = isLiked 
      ? currentLikes.filter((id: string) => id !== user.id)
      : [...currentLikes, user.id];

    const { error } = await supabase
      .from('posts')
      .update({ likes: updatedLikes })
      .eq('id', postId);

    if (error) throw error;
  }
};

export const likeComment = async (commentId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get current comment likes
  const { data: comment } = await supabase
    .from('comments')
    .select('likes')
    .eq('id', commentId)
    .single();

  if (comment) {
    const currentLikes = comment.likes || [];
    const isLiked = currentLikes.includes(user.id);
    
    const updatedLikes = isLiked 
      ? currentLikes.filter((id: string) => id !== user.id)
      : [...currentLikes, user.id];

    const { error } = await supabase
      .from('comments')
      .update({ likes: updatedLikes })
      .eq('id', commentId);

    if (error) throw error;
  }
};
