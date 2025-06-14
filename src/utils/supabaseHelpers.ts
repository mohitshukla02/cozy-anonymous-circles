
import { supabase } from '@/integrations/supabase/client';
import { generateAnonymousName } from './groupStorage';

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  group_context_id: string;
}

export interface UserInteraction {
  id: string;
  user1_id: string;
  user2_id: string;
  group_id: string;
  interaction_type: 'like' | 'comment';
  created_at: string;
}

export interface Meetup {
  id: string;
  group_id: string;
  title: string;
  description: string | null;
  date_time: string;
  location: string;
  created_by: string;
  created_at: string;
  status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
}

export interface MeetupRSVP {
  id: string;
  meetup_id: string;
  user_id: string;
  status: 'interested' | 'attending' | 'not_attending';
  checked_in: boolean;
  created_at: string;
}

// Check if two users can message each other (3+ mutual interactions)
export const canUsersMessage = async (user1Id: string, user2Id: string): Promise<boolean> => {
  const { data: interactions, error } = await supabase
    .from('user_interactions')
    .select('*')
    .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`);

  if (error) {
    console.error('Error checking message eligibility:', error);
    return false;
  }

  return (interactions?.length || 0) >= 3;
};

// Track user interaction (like or comment)
export const trackUserInteraction = async (
  user1Id: string,
  user2Id: string,
  groupId: string,
  type: 'like' | 'comment'
): Promise<void> => {
  const { error } = await supabase
    .from('user_interactions')
    .upsert({
      user1_id: user1Id,
      user2_id: user2Id,
      group_id: groupId,
      interaction_type: type
    }, {
      onConflict: 'user1_id,user2_id,group_id,interaction_type'
    });

  if (error) {
    console.error('Error tracking interaction:', error);
  }
};

// Get conversations for a user
export const getUserConversations = async (userId: string) => {
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      groups:group_context_id(name)
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }

  // Group messages by conversation partner
  const conversations = new Map();
  messages?.forEach(message => {
    const partnerId = message.sender_id === userId ? message.recipient_id : message.sender_id;
    const key = `${partnerId}-${message.group_context_id}`;
    
    if (!conversations.has(key)) {
      conversations.set(key, {
        partnerId,
        groupId: message.group_context_id,
        groupName: message.groups?.name,
        lastMessage: message,
        unreadCount: 0,
        messages: []
      });
    }
    
    const conv = conversations.get(key);
    conv.messages.push(message);
    
    if (message.recipient_id === userId && !message.read_at) {
      conv.unreadCount++;
    }
  });

  return Array.from(conversations.values());
};

// Send a message
export const sendMessage = async (
  senderId: string,
  recipientId: string,
  content: string,
  groupContextId: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      recipient_id: recipientId,
      content: content.trim(),
      group_context_id: groupContextId
    });

  if (error) {
    console.error('Error sending message:', error);
    return false;
  }

  return true;
};

// Mark message as read
export const markMessageAsRead = async (messageId: string): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('id', messageId);

  if (error) {
    console.error('Error marking message as read:', error);
  }
};

// Create a meetup
export const createMeetup = async (meetup: {
  groupId: string;
  title: string;
  description?: string;
  dateTime: string;
  location: string;
  createdBy: string;
}): Promise<boolean> => {
  const { error } = await supabase
    .from('meetups')
    .insert({
      group_id: meetup.groupId,
      title: meetup.title,
      description: meetup.description,
      date_time: meetup.dateTime,
      location: meetup.location,
      created_by: meetup.createdBy
    });

  if (error) {
    console.error('Error creating meetup:', error);
    return false;
  }

  return true;
};

// RSVP to a meetup
export const rsvpToMeetup = async (
  meetupId: string,
  userId: string,
  status: 'interested' | 'attending' | 'not_attending'
): Promise<boolean> => {
  const { error } = await supabase
    .from('meetup_rsvps')
    .upsert({
      meetup_id: meetupId,
      user_id: userId,
      status
    }, {
      onConflict: 'meetup_id,user_id'
    });

  if (error) {
    console.error('Error RSVPing to meetup:', error);
    return false;
  }

  return true;
};

// Check in to a meetup
export const checkInToMeetup = async (meetupId: string, userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('meetup_rsvps')
    .update({ checked_in: true })
    .eq('meetup_id', meetupId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error checking in to meetup:', error);
    return false;
  }

  // Check if we have enough check-ins (3+) to mark meetup as completed
  const { data: checkIns } = await supabase
    .from('meetup_rsvps')
    .select('*')
    .eq('meetup_id', meetupId)
    .eq('checked_in', true);

  if (checkIns && checkIns.length >= 3) {
    await supabase
      .from('meetups')
      .update({ status: 'completed' })
      .eq('id', meetupId);
  }

  return true;
};

// Get groups approaching deletion deadline
export const getGroupsNearDeadline = async () => {
  const now = new Date();
  const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  const { data: groups, error } = await supabase
    .from('groups')
    .select('*')
    .eq('type', 'local-meetup')
    .not('meetup_deadline', 'is', null)
    .lt('meetup_deadline', twoWeeksFromNow.toISOString());

  if (error) {
    console.error('Error fetching groups near deadline:', error);
    return [];
  }

  return groups?.map(group => {
    const deadline = new Date(group.meetup_deadline);
    let warningLevel = 'active';
    
    if (deadline <= twoDaysFromNow) {
      warningLevel = 'final_warning';
    } else if (deadline <= oneWeekFromNow) {
      warningLevel = 'warning';
    }

    return { ...group, warningLevel };
  }) || [];
};
