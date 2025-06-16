
import React, { useState, useEffect } from 'react';
import { Users, Crown, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../../hooks/use-toast';

interface GroupMember {
  user_id: string;
  role: string;
  join_date: string;
  anonymous_name: string;
}

interface UserProfile {
  user_id: string;
  username: string;
}

interface GroupMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  isAdmin: boolean;
}

const GroupMembersModal = ({ isOpen, onClose, groupId, groupName, isAdmin }: GroupMembersModalProps) => {
  const [members, setMembers] = useState<(GroupMember & { profile?: UserProfile })[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && groupId) {
      loadMembers();
    }
  }, [isOpen, groupId]);

  const loadMembers = async () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can view the member list.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get group members
      const { data: memberData, error: memberError } = await supabase
        .from('user_groups')
        .select('user_id, role, join_date, anonymous_name')
        .eq('group_id', groupId)
        .order('join_date', { ascending: false });

      if (memberError) throw memberError;

      // Get user profiles for the members
      const userIds = memberData.map(member => member.user_id);
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id, username')
        .in('user_id', userIds);

      if (profileError) throw profileError;

      // Combine member data with profiles
      const membersWithProfiles = memberData.map(member => ({
        ...member,
        profile: profileData.find(profile => profile.user_id === member.user_id)
      }));

      setMembers(membersWithProfiles);
    } catch (error) {
      console.error('Error loading members:', error);
      toast({
        title: "Error",
        description: "Failed to load group members.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users size={20} />
            {groupName} Members ({members.length})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 dark:border-gray-400 mx-auto"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No members found.
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div 
                  key={member.user_id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {(member.profile?.username || member.anonymous_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {member.profile?.username || member.anonymous_name || 'Unknown User'}
                        </span>
                        {member.role === 'admin' && (
                          <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700">
                            <Crown size={12} className="mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={12} />
                        <span>Joined {new Date(member.join_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupMembersModal;
