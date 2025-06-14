
import React from 'react';
import { Users, Heart, ArrowRight, MapPin } from 'lucide-react';
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
      className={`group relative bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100/50 hover:border-gray-200/80 transition-all duration-200 hover:shadow-lg hover:shadow-gray-100/50 hover:-translate-y-0.5 ${
        isJoined ? 'cursor-pointer' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-xl pointer-events-none" />
      
      <div className="relative">
        <div className="flex justify-between items-start mb-3">
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
              {/* Group Type Badge */}
              <Badge 
                variant="outline"
                className={`text-xs px-2 py-0.5 border-0 font-medium ${
                  group.type === 'local-meetup' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {group.type === 'local-meetup' ? 'Local' : 'Global'}
              </Badge>
            </div>
            
            {/* Location for local groups */}
            {group.type === 'local-meetup' && group.location && (
              <div className="flex items-center gap-1 mb-2 text-xs text-gray-500">
                <MapPin size={12} />
                <span>{group.location.city}, {group.location.region}</span>
              </div>
            )}
            
            <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">
              {group.description}
            </p>
          </div>
          {isJoined && (
            <ArrowRight size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors ml-2 flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{group.memberIds.length}/{group.memberLimit}</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <span>Created {new Date(group.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {group.tags.slice(0, 3).map(tagId => (
            <Badge 
              key={tagId}
              variant="outline"
              className={`text-xs px-2 py-0.5 border-0 font-medium ${
                userTags.includes(tagId) 
                  ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700' 
                  : 'bg-gray-50 text-gray-600'
              }`}
            >
              {tagNames.get(tagId) || tagId}
            </Badge>
          ))}
          {group.tags.length > 3 && (
            <span className="text-xs text-gray-400 px-2 py-0.5">+{group.tags.length - 3}</span>
          )}
        </div>

        <button
          onClick={handleJoinClick}
          disabled={group.memberIds.length >= group.memberLimit}
          className={`
            w-full py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 relative overflow-hidden
            ${isJoined 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 border border-green-200/50' 
              : group.memberIds.length >= group.memberLimit
              ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-sm hover:shadow-md'
            }
          `}
        >
          {isJoined ? 'View Group' : group.memberIds.length >= group.memberLimit ? 'Full' : 'Join Group'}
        </button>
      </div>
    </div>
  );
};

export default GroupCard;
