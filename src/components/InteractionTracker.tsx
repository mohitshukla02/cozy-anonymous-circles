
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { trackUserInteraction } from '@/utils/messaging';

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

  const handleInteraction = async () => {
    // Always call the original interaction first
    onInteraction?.();

    // Don't track self-interactions
    if (!user?.id || user.id === targetUserId) {
      return;
    }

    try {
      // Track the interaction for messaging eligibility
      await trackUserInteraction(user.id, targetUserId, groupId, interactionType);
      console.log(`Tracked ${interactionType} interaction between ${user.id} and ${targetUserId} in group ${groupId}`);
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  return (
    <div onClick={handleInteraction}>
      {children}
    </div>
  );
};

export default InteractionTracker;
