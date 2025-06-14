
import React from 'react';
import { Users, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Group } from '../types/groups';
import { Badge } from './ui/badge';
import { TAG_CATEGORIES } from '../types/tags';

interface GroupCardProps {
  group: Group;
  userTags: string[];
  onJoin: (groupId: string) => void;
  isJoined: boolean;
}

const GroupCard = ({ group, userTags, onJoin, isJoined }: GroupCardProps) => {
  const navigate = useNavigate();
  const matchingTags = group.tags.filter(tag => userTags.includes(tag));
  const tagNames = new Map();
  TAG_CATEGORIES.forEach(category => {
    category.tags.forEach(tag => {
      tagNames.set(tag.id, tag.name);
    });
  });

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the join button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    if (isJoined) {
      navigate(`/groups/${group.id}`);
    }
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onJoin(group.id);
  };

  return (
    <div 
      className={`bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-md transition-all duration-300 border border-gray-100 ${
        isJoined ? 'cursor-pointer' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-gray-800 mb-2 text-lg">
            {group.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            {group.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{group.memberIds.length}/{group.memberLimit} members</span>
        </div>
        {matchingTags.length > 0 && (
          <div className="flex items-center gap-1">
            <Heart size={14} className="text-pink-400" />
            <span>{matchingTags.length} shared interests</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {group.tags.map(tagId => (
          <Badge 
            key={tagId}
            variant={userTags.includes(tagId) ? "default" : "outline"}
            className={`text-xs ${userTags.includes(tagId) ? 'bg-pastel-pink text-pink-800' : ''}`}
          >
            {tagNames.get(tagId) || tagId}
          </Badge>
        ))}
      </div>

      <button
        onClick={handleJoinClick}
        disabled={group.memberIds.length >= group.memberLimit}
        className={`
          w-full py-2 px-4 rounded-full text-sm font-medium transition-all
          ${isJoined 
            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
            : group.memberIds.length >= group.memberLimit
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
          }
        `}
      >
        {isJoined ? 'View Group' : group.memberIds.length >= group.memberLimit ? 'Full' : 'Join Group'}
      </button>
    </div>
  );
};

export default GroupCard;
