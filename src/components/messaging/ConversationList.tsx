
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { MessageSquare } from 'lucide-react';
import { generateAnonymousName } from '../../utils/groupStorage';

interface Conversation {
  partnerId: string;
  groupId: string;
  groupName: string;
  lastMessage: any;
  unreadCount: number;
  messages: any[];
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  userProfiles: {[key: string]: any};
}

const ConversationList = ({ 
  conversations, 
  activeConversation, 
  onSelectConversation,
  userProfiles 
}: ConversationListProps) => {
  const getDisplayName = (userId: string) => {
    const profile = userProfiles[userId];
    return profile?.username || generateAnonymousName(userId, activeConversation?.groupId || '');
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare size={20} />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-center text-gray-500 p-4 text-sm">
              No conversations yet
            </p>
          ) : (
            conversations.map((conv) => (
              <div
                key={`${conv.partnerId}-${conv.groupId}`}
                className={`p-3 cursor-pointer hover:bg-gray-50 border-b ${
                  activeConversation?.partnerId === conv.partnerId ? 'bg-blue-50' : ''
                }`}
                onClick={() => onSelectConversation(conv)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {getDisplayName(conv.partnerId)}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      in {conv.groupName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {conv.lastMessage?.content || 'Start conversation'}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
