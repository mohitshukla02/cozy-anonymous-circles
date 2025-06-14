
import React from 'react';
import { Users, Heart, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Group } from '../types/groups';
import { Badge } from './ui/badge';
import { TAG_CATEGORIES } from '../types/tags';

interface GroupCardProps {
  group: Group;
  userTags?: string[];
  onJoin?: (groupId: string) => void;
  onViewGroup?: (group: Group) => void;
  isJoined?: boolean;
}

// Helper function to capitalize first letter of each word
const capitalizeWords = (str: string) => {
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

const GroupCard = ({ group, userTags = [], onJoin, onViewGroup, isJoined = false }: GroupCardProps) => {
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
    } else if (onViewGroup) {
      onViewGroup(group);
    }
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewGroup) {
      onViewGroup(group);
    }
  };

  return (
    <div 
      className={`group relative overflow-hidden rounded-xl border bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
      onClick={handleCardClick}
    >
      {/* Group Image */}
      {group.image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={group.image} 
            alt={group.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          {/* Group Type Badge */}
          <Badge 
            variant="outline"
            className={`absolute top-3 right-3 text-xs px-3 py-1 border-0 font-medium backdrop-blur-md ${
              group.type === 'local-meetup' 
                ? 'bg-green-500/90 text-white shadow-lg' 
                : 'bg-blue-500/90 text-white shadow-lg'
            }`}
          >
            {group.type === 'local-meetup' ? 'Local' : 'Global'}
          </Badge>
        </div>
      )}

      <div className="p-6 space-y-4 flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                {group.name}
              </h3>
              {matchingTags.length > 0 && (
                <div className="flex items-center gap-1 text-pink-500">
                  <Heart size={14} fill="currentColor" />
                  <span className="text-sm font-medium">{matchingTags.length}</span>
                </div>
              )}
            </div>
            
            {/* Location for local groups */}
            {group.type === 'local-meetup' && group.locationCity && (
              <div className="flex items-center gap-1 mb-3 text-sm text-gray-600">
                <MapPin size={14} />
                <span>{group.locationCity}, {group.locationRegion}</span>
              </div>
            )}
          </div>
          {isJoined && (
            <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors ml-3 flex-shrink-0" />
          )}
        </div>

        {/* Description - Fixed 2 lines */}
        <div className="h-10 flex items-start">
          <p className="text-gray-600 text-sm leading-5 line-clamp-2">
            {group.description}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{group.memberIds.length}/{group.memberLimit}</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <span>Created {new Date(group.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>

        {/* Tags - Fixed 2 lines */}
        <div className="h-16 flex flex-col justify-start">
          <div className="flex flex-wrap gap-2">
            {group.tags.slice(0, 3).map(tagId => (
              <Badge 
                key={tagId}
                variant="outline"
                className={`text-sm px-3 py-1 border-0 font-medium ${
                  userTags.includes(tagId) 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tagNames.get(tagId) || capitalizeWords(tagId)}
              </Badge>
            ))}
            {group.tags.length > 3 && (
              <span className="text-sm text-gray-400 px-3 py-1">+{group.tags.length - 3}</span>
            )}
          </div>
        </div>

        <button
          onClick={handleViewClick}
          className="w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg mt-auto"
        >
          View Group
        </button>
      </div>
    </div>
  );
};

export default GroupCard;
