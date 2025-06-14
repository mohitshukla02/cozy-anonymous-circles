
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
  console.log('Creating user profile:', profile);
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile])
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
  console.log('Updating user profile for:', userId, 'with:', updates);
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
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
