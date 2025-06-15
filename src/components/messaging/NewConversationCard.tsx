
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { MessageSquare, Send, Users } from 'lucide-react';

interface NewConversationCardProps {
  canMessage: boolean;
  newMessage: string;
  onMessageChange: (message: string) => void;
  onStartConversation: () => void;
}

const NewConversationCard = ({ 
  canMessage, 
  newMessage, 
  onMessageChange, 
  onStartConversation 
}: NewConversationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare size={20} />
          Start Conversation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {canMessage ? (
          <>
            <p className="text-sm text-gray-600">
              You can now message this user! Start a conversation below.
            </p>
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => onMessageChange(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && newMessage.trim() && onStartConversation()}
              />
              <Button 
                onClick={onStartConversation}
                disabled={!newMessage.trim()}
                size="sm"
              >
                <Send size={16} />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            <Users size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Interact more to unlock messaging
            </p>
            <p className="text-xs text-gray-500">
              Like or comment on each other's posts 3+ times to start messaging
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewConversationCard;
