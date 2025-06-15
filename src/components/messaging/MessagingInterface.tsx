
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserConversations, sendMessage, canUsersMessage } from '../../utils/messaging';
import { getUserProfile } from '../../utils/userProfileStorage';
import { useToast } from '../../hooks/use-toast';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import NewConversationCard from './NewConversationCard';

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
  const [userProfiles, setUserProfiles] = useState<{[key: string]: any}>({});

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

  const loadUserProfile = async (userId: string) => {
    if (userProfiles[userId]) return userProfiles[userId];
    
    const profile = await getUserProfile(userId);
    if (profile) {
      setUserProfiles(prev => ({ ...prev, [userId]: profile }));
      return profile;
    }
    return null;
  };

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      const convs = await getUserConversations(user.id);
      setConversations(convs);
      
      // Load user profiles for all conversation partners
      const partnerIds = convs.map(c => c.partnerId);
      for (const partnerId of partnerIds) {
        await loadUserProfile(partnerId);
      }
      
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
        loadConversations();
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading conversations...</div>
      </div>
    );
  }

  // If we have a selected partner but no conversation yet
  if (selectedPartnerId && !activeConversation) {
    return (
      <NewConversationCard
        canMessage={canMessage}
        newMessage={newMessage}
        onMessageChange={setNewMessage}
        onStartConversation={startNewConversation}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      <ConversationList
        conversations={conversations}
        activeConversation={activeConversation}
        onSelectConversation={setActiveConversation}
        userProfiles={userProfiles}
      />
      <ChatWindow
        activeConversation={activeConversation}
        newMessage={newMessage}
        onMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        currentUserId={user?.id || ''}
        userProfiles={userProfiles}
      />
    </div>
  );
};

export default MessagingInterface;
