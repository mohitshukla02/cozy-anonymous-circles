
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, Clock, AlertTriangle } from 'lucide-react';
import MessagingInterface from '@/components/MessagingInterface';
import { useUser } from '@/contexts/UserContext';
import { getUserConversations, getGroupsNearDeadline } from '@/utils/supabaseHelpers';

const Messages = () => {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [warningGroups, setWarningGroups] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadMessageStats();
      loadGroupWarnings();
    }
  }, [user]);

  const loadMessageStats = async () => {
    if (!user?.username) return;
    
    try {
      const conversations = await getUserConversations(user.username);
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} unread</Badge>
          )}
        </div>
        <p className="text-gray-600">
          Connect with people you've built relationships with in groups
        </p>
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

      {/* How Messaging Works */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Users className="w-5 h-5" />
            How Anonymous Messaging Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                1
              </div>
              <h4 className="font-medium text-blue-800">Interact in Groups</h4>
              <p className="text-blue-700">Like and comment on posts from others in shared groups</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                2
              </div>
              <h4 className="font-medium text-blue-800">Build Trust</h4>
              <p className="text-blue-700">After 3+ mutual interactions, messaging unlocks</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                3
              </div>
              <h4 className="font-medium text-blue-800">Start Chatting</h4>
              <p className="text-blue-700">Send direct messages with your anonymous group identity</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messaging Interface */}
      <MessagingInterface />
    </div>
  );
};

export default Messages;
