
import { supabase } from '@/integrations/supabase/client';

// Track when user sends a message
export async function trackMessageSent(userId: string) {
  await supabase.from('message_sends').insert({ user_id: userId });
}

// Track when user creates a group
export async function trackGroupCreated(userId: string) {
  await supabase.from('group_creations').insert({ user_id: userId });
}

// Track post or comment creation
export async function trackContentCreated(userId: string, type: 'post' | 'comment') {
  await supabase.from('content_creations').insert({ user_id: userId, content_type: type });
}
