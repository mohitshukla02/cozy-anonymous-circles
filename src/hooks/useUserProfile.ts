
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, createUserProfile, updateUserProfile, UserProfile } from '@/utils/userProfileStorage';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    console.log('Loading profile for user:', user.id);
    setLoading(true);
    
    try {
      let userProfile = await getUserProfile(user.id);
      
      // If no profile exists, create one
      if (!userProfile) {
        console.log('No profile found, creating new one');
        const username = user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous';
        
        userProfile = await createUserProfile({
          user_id: user.id,
          username,
          selected_tags: []
        });
      }
      
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at'>>) => {
    if (!user || !profile) return false;
    
    try {
      const updatedProfile = await updateUserProfile(user.id, updates);
      if (updatedProfile) {
        setProfile(updatedProfile);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    refreshProfile: loadProfile
  };
};
