
import React from 'react';
import { generateAnonymousName } from '@/utils/groupStorage';

interface UserAvatarWithNameProps {
  userId: string;
  groupId: string;
  className?: string;
  showName?: boolean;
}

const UserAvatarWithName = ({ userId, groupId, className = "", showName = true }: UserAvatarWithNameProps) => {
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
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-8 h-8 rounded-full ${getAvatarColor(userId)} flex items-center justify-center text-white text-xs font-medium`}>
        {initials}
      </div>
      {showName && (
        <span className="text-sm font-medium text-gray-900">{anonymousName}</span>
      )}
    </div>
  );
};

export default UserAvatarWithName;
