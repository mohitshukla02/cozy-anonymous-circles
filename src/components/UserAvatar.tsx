
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const UserAvatar = ({ size = 'md', className }: UserAvatarProps) => {
  const { user } = useAuth();
  const { profile } = useUserProfile();

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-20 w-20'
  };

  const fallbackSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-xl'
  };

  const username = profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0] || 'Anonymous';

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={user?.user_metadata?.avatar_url} />
      <AvatarFallback className={`bg-blue-100 text-blue-700 ${fallbackSizeClasses[size]}`}>
        {username.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
