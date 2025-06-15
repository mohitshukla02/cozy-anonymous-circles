
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Invitation {
  id: string;
  invitee_email: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
  accepted_at: string | null;
}

export const useInvitations = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [remainingInvites, setRemainingInvites] = useState(5);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchInvitations = async () => {
    if (!user) return;

    try {
      // Fetch user's invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('invitations')
        .select('*')
        .eq('inviter_id', user.id)
        .order('created_at', { ascending: false });

      if (invitationsError) {
        console.error('Error fetching invitations:', invitationsError);
        return;
      }

      // Cast the data to match our Invitation interface
      const typedInvitations: Invitation[] = (invitationsData || []).map(invitation => ({
        ...invitation,
        status: invitation.status as 'pending' | 'accepted' | 'expired'
      }));

      setInvitations(typedInvitations);

      // Fetch remaining invites count
      const { data: remainingData, error: remainingError } = await supabase
        .rpc('get_remaining_invites_for_user', { user_id: user.id });

      if (remainingError) {
        console.error('Error fetching remaining invites:', remainingError);
        return;
      }

      setRemainingInvites(remainingData || 0);
    } catch (error) {
      console.error('Error in fetchInvitations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  const refreshInvitations = () => {
    fetchInvitations();
  };

  return {
    invitations,
    remainingInvites,
    loading,
    refreshInvitations,
  };
};
