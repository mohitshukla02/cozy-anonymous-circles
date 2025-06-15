
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { MessageSquare, Send, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserConversations, sendMessage, markMessageAsRead, canUsersMessage } from '../../utils/messaging';
import { useToast } from '../../hooks/use-toast';

interface Conversation {
  partnerId: string;
  groupId: string;
  groupName: string;
  lastMessage: any;
  unreadCount: number;
  messages: any[];
}

interface MessagingInterfaceProps {
  selectedPartnerId?: string;
  groupContextId?: string;
}

const MessagingInterface = ({ selectedPartnerId, groupContextId }: MessagingInterfaceProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [canMessage, setCanMessage] = useState(false);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedPartnerId && groupContextId && user) {
      checkMessagingEligibility();
    }
  }, [selectedPartnerId, groupContextId, user]);

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      const convs = await getUserConversations(user.id);
      setConversations(convs);
      
      // Auto-select conversation if partnerId is provided
      if (selectedPartnerId) {
        const conversation = convs.find(c => c.partnerId === selectedPartnerId);
        if (conversation) {
          setActiveConversation(conversation);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkMessagingEligibility = async () => {
    if (!user || !selectedPartnerId) return;
    
    try {
      const eligible = await canUsersMessage(user.id, selectedPartnerId);
      setCanMessage(eligible);
    } catch (error) {
      console.error('Error checking messaging eligibility:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim() || !activeConversation) return;

    try {
      const success = await sendMessage(
        user.id,
        activeConversation.partnerId,
        newMessage.trim(),
        activeConversation.groupId
      );

      if (success) {
        setNewMessage('');
        loadConversations(); // Reload to show new message
        toast({
          title: "Message sent",
          description: "Your message has been delivered"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const startNewConversation = async () => {
    if (!user || !selectedPartnerId || !groupContextId || !canMessage) return;

    try {
      const success = await sendMessage(
        user.id,
        selectedPartnerId,
        newMessage.trim(),
        groupContextId
      );

      if (success) {
        setNewMessage('');
        loadConversations();
        toast({
          title: "Conversation started",
          description: "Your message has been sent"
        });
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center">Loading conversations...</div>
        </CardContent>
      </Card>
    );
  }

  // If we have a selected partner but no conversation yet
  if (selectedPartnerId && !activeConversation) {
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
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && newMessage.trim() && startNewConversation()}
                />
                <Button 
                  onClick={startNewConversation}
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
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      {/* Conversations List */}
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
                  onClick={() => setActiveConversation(conv)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        Partner in {conv.groupName}
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

      {/* Active Conversation */}
      <Card className="md:col-span-2">
        {activeConversation ? (
          <>
            <CardHeader>
              <CardTitle className="text-sm">
                Conversation in {activeConversation.groupName}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[500px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {activeConversation.messages.reverse().map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-2 rounded-lg text-sm ${
                        message.sender_id === user?.id
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
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && newMessage.trim() && handleSendMessage()}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                >
                  <Send size={16} />
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-[500px]">
            <div className="text-center text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-2" />
              <p>Select a conversation to start messaging</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default MessagingInterface;
