
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle } from 'lucide-react';
import MessagingInterface from '@/components/MessagingInterface';
import MessagingGuidelinesModal from '@/components/MessagingGuidelinesModal';
import { useAuth } from '@/contexts/AuthContext';
import { getUserConversations, getGroupsNearDeadline } from '@/utils/supabaseHelpers';

const Messages = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [warningGroups, setWarningGroups] = useState<any[]>([]);
  const [showGuidelines, setShowGuidelines] = useState(false);

  useEffect(() => {
    if (user) {
      loadMessageStats();
      loadGroupWarnings();
      
      // Show guidelines modal on first visit
      const hasSeenGuidelines = localStorage.getItem('messaging-guidelines-seen');
      if (!hasSeenGuidelines) {
        setShowGuidelines(true);
      }
    }
  }, [user]);

  const loadMessageStats = async () => {
    if (!user?.id) return;
    
    try {
      const conversations = await getUserConversations(user.id);
      const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error loading message stats:', error);
    }
  };

  const loadGroupWarnings = async () => {
    try {
      const groups = await getGroupsNearDeadline();
      setWarningGroups(groups);
    } catch (error) {
      console.error('Error loading group warnings:', error);
    }
  };

  const handleGuidelinesClose = () => {
    setShowGuidelines(false);
    localStorage.setItem('messaging-guidelines-seen', 'true');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl pt-16">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <div className="flex items-center gap-3">
          <p className="text-gray-600">
            Connect with people you've built relationships with in groups
          </p>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} unread</Badge>
          )}
        </div>
      </div>

      {/* Group Warnings */}
      {warningGroups.length > 0 && (
        <Card className="mb-6 border-l-4 border-l-yellow-500 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              Group Activity Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {warningGroups.map((group) => (
                <div key={group.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <h4 className="font-medium text-gray-900">{group.name}</h4>
                    <p className="text-sm text-gray-600">
                      {group.warningLevel === 'final_warning' 
                        ? 'Final warning: Schedule a meetup to save this group!'
                        : 'Schedule a meetup to keep this group active'
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      {Math.ceil((new Date(group.meetup_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messaging Interface */}
      <MessagingInterface />

      {/* Guidelines Modal */}
      <MessagingGuidelinesModal 
        open={showGuidelines} 
        onClose={handleGuidelinesClose} 
      />
    </div>
  );
};

export default Messages;
