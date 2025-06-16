
import React from 'react';
import { Users } from 'lucide-react';
import { Group } from '../../types/groups';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { TAG_CATEGORIES } from '../../types/tags';

interface GroupInfoCardProps {
  group: Group;
  isArchived: boolean;
}

const GroupInfoCard = ({ group, isArchived }: GroupInfoCardProps) => {
  const tagNames = new Map();
  TAG_CATEGORIES.forEach(category => {
    category.tags.forEach(tag => {
      tagNames.set(tag.id, tag.name);
    });
  });

  return (
    <Card className={`mb-6 rounded-2xl border-0 shadow-sm bg-white/90 backdrop-blur-sm ${isArchived ? 'opacity-75' : ''}`}>
      {group.image && (
        <div className="relative h-64 overflow-hidden rounded-t-2xl">
          <img 
            src={group.image} 
            alt={group.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          <Badge 
            variant="outline"
            className="absolute top-4 right-4 text-xs px-3 py-1.5 border-0 font-medium backdrop-blur-md bg-white/90 text-gray-700 shadow-sm rounded-full"
          >
            {group.type === 'local-meetup' ? 'Local' : 'Global'}
          </Badge>
        </div>
      )}
      <CardContent className="p-6">
        <p className="text-gray-700 text-sm mb-4 leading-relaxed">{group.description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Users size={14} />
            <span>{group.memberIds.length}/{group.memberLimit} members</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <span>Created {new Date(group.createdDate).toLocaleDateString()}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {group.tags.map(tagId => (
            <Badge 
              key={tagId} 
              variant="outline" 
              className="text-xs px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-0 font-medium rounded-full"
            >
              {tagNames.get(tagId)}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupInfoCard;
