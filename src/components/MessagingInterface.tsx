import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Send, Clock, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserConversations, sendMessage, markMessageAsRead } from '@/utils/supabaseHelpers';
import { generateAnonymousName } from '@/utils/groupStorage';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  partnerId: string;
  groupId: string;
  groupName: string;
  lastMessage: any;
  unreadCount: number;
  messages: any[];
}

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

const MessagingInterface = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user?.id) return;
    
    try {
      const convs = await getUserConversations(user.id);
      setConversations(convs);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user?.id) return;

    if (newMessage.length > 500) {
      toast({
        title: "Message too long",
        description: "Messages must be 500 characters or less",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = await sendMessage(
        user.id,
        selectedConversation.partnerId,
        newMessage,
        selectedConversation.groupId
      );

      if (success) {
        setNewMessage('');
        await loadConversations();
        // Update selected conversation with new message
        const updatedConvs = await getUserConversations(user.id);
        const updatedConv = updatedConvs.find(c => 
          c.partnerId === selectedConversation.partnerId && 
          c.groupId === selectedConversation.groupId
        );
        if (updatedConv) {
          setSelectedConversation(updatedConv);
        }
      } else {
        throw new Error('Failed to send message');
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

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // Mark unread messages as read
    if (conversation.unreadCount > 0 && user?.id) {
      const unreadMessages = conversation.messages.filter(
        msg => msg.recipient_id === user.id && !msg.read_at
      );
      
      for (const msg of unreadMessages) {
        await markMessageAsRead(msg.id);
      }
      
      // Refresh conversations to update unread counts
      loadConversations();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getMessageStatus = (message: Message) => {
    if (message.sender_id !== user?.id) return null;
    
    if (message.read_at) {
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    }
    return <Check className="w-3 h-3 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      {/* Conversations List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No conversations yet</p>
                <p className="text-sm mt-1">Interact with others in groups to start messaging!</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={`${conv.partnerId}-${conv.groupId}`}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedConversation?.partnerId === conv.partnerId &&
                    selectedConversation?.groupId === conv.groupId
                      ? 'bg-blue-50 border-l-4 border-l-blue-500'
                      : ''
                  }`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">
                          {generateAnonymousName(conv.partnerId, conv.groupId)}
                        </h4>
                        {conv.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{conv.groupName}</p>
                      <p className="text-sm text-gray-700 truncate">
                        {conv.lastMessage.content}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatMessageTime(conv.lastMessage.created_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="md:col-span-2">
        {selectedConversation ? (
          <>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {generateAnonymousName(selectedConversation.partnerId, selectedConversation.groupId)}
              </CardTitle>
              <p className="text-sm text-gray-500">in {selectedConversation.groupName}</p>
            </CardHeader>
            <Separator />
            <CardContent className="p-0 flex flex-col h-[460px]">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {selectedConversation.messages
                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] px-3 py-2 rounded-lg ${
                            message.sender_id === user?.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-1 gap-2">
                            <span className="text-xs opacity-70">
                              {formatMessageTime(message.created_at)}
                            </span>
                            {getMessageStatus(message)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message... (500 char limit)"
                    maxLength={500}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {newMessage.length}/500 characters
                </p>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-sm">Choose a conversation from the left to start chatting</p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-700 text-sm">
                <p className="font-medium">How messaging works:</p>
                <p>You can only message people you've interacted with 3+ times in shared groups</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default MessagingInterface;
