
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  bio?: string;
  selected_tags: string[];
  location_city?: string;
  location_region?: string;
  location_coordinates?: { lat: number; lng: number };
  reddit_karma?: number;
  created_at: string;
  updated_at: string;
}

// --- Sanitization helper ---
function sanitizeInput(str: string): string {
  let clean = str
    // remove script tags
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    // remove HTML tags
    .replace(/<\/?[^>]+(>|$)/g, "")
    // remove on* attributes
    .replace(/on\w+=["'][^"']*["']/gi, "")
    // remove non-printable characters
    .replace(/[^\x20-\x7E\r\n]+/g, "");
  // Enforce a max length (username: 40, bio: 300, generic: 300)
  return clean.trim().slice(0, 300);
}

// Separate strict username sanitizer!
function sanitizeUsername(username: string): string {
  const clean = username.replace(/[^a-zA-Z0-9_\- ]/g, '').trim();
  return clean.slice(0, 40) || 'Anonymous';
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  console.log('Getting user profile for:', userId);
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
    
    console.log('Retrieved user profile:', data);
    return data as UserProfile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

export const createUserProfile = async (profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile | null> => {
  // Sanitize user-provided fields!
  const sanitized: any = {
    ...profile,
    username: sanitizeUsername(profile.username),
    bio: profile.bio ? sanitizeInput(profile.bio) : undefined,
    location_city: profile.location_city ? sanitizeInput(profile.location_city) : undefined,
    location_region: profile.location_region ? sanitizeInput(profile.location_region) : undefined,
  };
  console.log('Creating user profile:', sanitized);

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([sanitized])
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }

    console.log('Created user profile:', data);
    return data as UserProfile;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at'>>): Promise<UserProfile | null> => {
  // Defensive: sanitize every string field!
  const sanitizedUpdates: any = { ...updates };
  if (sanitizedUpdates.username) sanitizedUpdates.username = sanitizeUsername(sanitizedUpdates.username);
  if (sanitizedUpdates.bio) sanitizedUpdates.bio = sanitizeInput(sanitizedUpdates.bio);
  if (sanitizedUpdates.location_city) sanitizedUpdates.location_city = sanitizeInput(sanitizedUpdates.location_city);
  if (sanitizedUpdates.location_region) sanitizedUpdates.location_region = sanitizeInput(sanitizedUpdates.location_region);
  sanitizedUpdates.updated_at = new Date().toISOString();

  console.log('Updating user profile for:', userId, 'with:', sanitizedUpdates);

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(sanitizedUpdates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
    console.log('Updated user profile:', data);
    return data as UserProfile;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return null;
  }
};

export const updateUserTags = async (userId: string, tags: string[]): Promise<boolean> => {
  console.log('Updating user tags for:', userId, 'tags:', tags);
  
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        selected_tags: tags,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error updating user tags:', error);
      return false;
    }
    
    console.log('Successfully updated user tags');
    return true;
  } catch (error) {
    console.error('Error in updateUserTags:', error);
    return false;
  }
};
