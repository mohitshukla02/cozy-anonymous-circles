
import React from 'react';
import { Users, Heart, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Group } from '../types/groups';
import { Badge } from './ui/badge';
import { ProgressiveBlurCard } from './ui/progressive-blur-card';
import { TAG_CATEGORIES } from '../types/tags';

interface GroupCardProps {
  group: Group;
  userTags?: string[];
  onJoin?: (groupId: string) => void;
  isJoined?: boolean;
}

// Helper function to capitalize first letter of each word
const capitalizeWords = (str: string) => {
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

const GroupCard = ({ group, userTags = [], onJoin, isJoined = false }: GroupCardProps) => {
  const navigate = useNavigate();
  const matchingTags = group.tags.filter(tag => userTags.includes(tag));
  const tagNames = new Map();
  TAG_CATEGORIES.forEach(category => {
    category.tags.forEach(tag => {
      tagNames.set(tag.id, capitalizeWords(tag.name));
    });
  });

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    if (isJoined) {
      navigate(`/groups/${group.id}`);
    }
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onJoin) {
      onJoin(group.id);
    }
  };

  return (
    <ProgressiveBlurCard 
      className={`group border-gray-100/50 hover:border-gray-200/80 hover:shadow-gray-100/50 ${
        isJoined ? 'cursor-pointer' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Group Image */}
      {group.image && (
        <div className="relative h-32 overflow-hidden">
          <img 
            src={group.image} 
            alt={group.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {/* Group Type Badge */}
          <Badge 
            variant="outline"
            className={`absolute top-2 right-2 text-xs px-2 py-0.5 border-0 font-medium backdrop-blur-sm ${
              group.type === 'local-meetup' 
                ? 'bg-green-100/90 text-green-700' 
                : 'bg-blue-100/90 text-blue-700'
            }`}
          >
            {group.type === 'local-meetup' ? 'Local' : 'Global'}
          </Badge>
        </div>
      )}

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                {group.name}
              </h3>
              {matchingTags.length > 0 && (
                <div className="flex items-center gap-1 text-pink-500">
                  <Heart size={12} fill="currentColor" />
                  <span className="text-xs font-medium">{matchingTags.length}</span>
                </div>
              )}
            </div>
            
            {/* Location for local groups */}
            {group.type === 'local-meetup' && group.locationCity && (
              <div className="flex items-center gap-1 mb-2 text-xs text-gray-500">
                <MapPin size={12} />
                <span>{group.locationCity}, {group.locationRegion}</span>
              </div>
            )}
            
            <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
              {group.description}
            </p>
          </div>
          {isJoined && (
            <ArrowRight size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors ml-2 flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{group.memberIds.length}/{group.memberLimit}</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <span>Created {new Date(group.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {group.tags.slice(0, 3).map(tagId => (
            <Badge 
              key={tagId}
              variant="outline"
              className={`text-xs px-2 py-0.5 border-0 font-medium ${
                userTags.includes(tagId) 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-gray-50 text-gray-600'
              }`}
            >
              {tagNames.get(tagId) || capitalizeWords(tagId)}
            </Badge>
          ))}
          {group.tags.length > 3 && (
            <span className="text-xs text-gray-400 px-2 py-0.5">+{group.tags.length - 3}</span>
          )}
        </div>

        {onJoin && (
          <button
            onClick={handleJoinClick}
            disabled={group.memberIds.length >= group.memberLimit}
            className={`
              w-full py-2 px-3 rounded-xl text-xs font-medium transition-all duration-200 relative overflow-hidden
              ${isJoined 
                ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200/50' 
                : group.memberIds.length >= group.memberLimit
                ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
              }
            `}
          >
            {isJoined ? 'View Group' : group.memberIds.length >= group.memberLimit ? 'Full' : 'Join Group'}
          </button>
        )}
      </div>
    </ProgressiveBlurCard>
  );
};

export default GroupCard;
