
import React from 'react';
import { generateAnonymousName } from '@/utils/groupStorage';
import { formatDistanceToNow } from 'date-fns';

interface UserAvatarWithNameProps {
  userId: string;
  groupId: string;
  className?: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTime?: boolean;
  timestamp?: string;
}

const UserAvatarWithName = ({ 
  userId, 
  groupId, 
  className = "", 
  showName = true,
  size = 'md',
  showTime = false,
  timestamp
}: UserAvatarWithNameProps) => {
  const anonymousName = generateAnonymousName(userId, groupId);
  
  // Generate a consistent color based on the user ID
  const getAvatarColor = (userId: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const initials = anonymousName.split(' ').map(n => n[0]).join('').toUpperCase();
  
  const avatarSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';
  const initialsSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs';
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${avatarSize} rounded-full ${getAvatarColor(userId)} flex items-center justify-center text-white ${initialsSize} font-medium`}>
        {initials}
      </div>
      {showName && (
        <div className="flex flex-col">
          <span className={`${textSize} font-medium text-gray-900`}>{anonymousName}</span>
          {showTime && timestamp && (
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAvatarWithName;
