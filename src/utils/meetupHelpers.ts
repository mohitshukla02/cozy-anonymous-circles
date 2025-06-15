
import { supabase } from '@/integrations/supabase/client';

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
