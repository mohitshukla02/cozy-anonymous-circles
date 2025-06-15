
import React from 'react';
import { Heart, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { trackUserInteraction } from '@/utils/messaging';
import { useToast } from '@/hooks/use-toast';

interface InteractionTrackerProps {
  targetUserId: string;
  groupId: string;
  onInteraction?: () => void;
  children: React.ReactNode;
  interactionType: 'like' | 'comment';
}

const InteractionTracker: React.FC<InteractionTrackerProps> = ({
  targetUserId,
  groupId,
  onInteraction,
  children,
  interactionType
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleInteraction = async (e: React.MouseEvent) => {
    if (!user?.id || user.id === targetUserId) {
      onInteraction?.();
      return;
    }

    try {
      // Track the interaction for messaging eligibility
      await trackUserInteraction(user.id, targetUserId, groupId, interactionType);
      
      // Check if this creates messaging eligibility
      // This is a simplified check - in a real app you'd query the total interactions
      toast({
        title: "Interaction recorded",
        description: "Keep interacting to unlock direct messaging!",
        duration: 2000
      });
      
      onInteraction?.();
    } catch (error) {
      console.error('Error tracking interaction:', error);
      onInteraction?.();
    }
  };

  return (
    <div onClick={handleInteraction} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
};

export default InteractionTracker;
