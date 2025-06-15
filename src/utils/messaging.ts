
import { supabase } from '@/integrations/supabase/client';
import { generateAnonymousName } from './groupStorage';
import { trackMessageSent } from './trackActivity';

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

  // Log the action
  await trackMessageSent(senderId);

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
