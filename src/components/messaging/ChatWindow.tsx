
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send, MessageSquare } from 'lucide-react';
import { generateAnonymousName } from '../../utils/groupStorage';

interface Conversation {
  partnerId: string;
  groupId: string;
  groupName: string;
  lastMessage: any;
  unreadCount: number;
  messages: any[];
}

interface ChatWindowProps {
  activeConversation: Conversation | null;
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  currentUserId: string;
  userProfiles: {[key: string]: any};
}

const ChatWindow = ({ 
  activeConversation, 
  newMessage, 
  onMessageChange, 
  onSendMessage,
  currentUserId,
  userProfiles 
}: ChatWindowProps) => {
  const getDisplayName = (userId: string) => {
    const profile = userProfiles[userId];
    return profile?.username || generateAnonymousName(userId, activeConversation?.groupId || '');
  };

  if (!activeConversation) {
    return (
      <Card className="md:col-span-2">
        <CardContent className="flex items-center justify-center h-[500px]">
          <div className="text-center text-gray-500">
            <MessageSquare size={48} className="mx-auto mb-2" />
            <p>Select a conversation to start messaging</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm">
          Conversation with {getDisplayName(activeConversation.partnerId)}
        </CardTitle>
        <p className="text-xs text-gray-500">in {activeConversation.groupName}</p>
      </CardHeader>
      <CardContent className="flex flex-col h-[500px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {activeConversation.messages.reverse().map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-2 rounded-lg text-sm ${
                  message.sender_id === currentUserId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && newMessage.trim() && onSendMessage()}
          />
          <Button 
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
          >
            <Send size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWindow;
