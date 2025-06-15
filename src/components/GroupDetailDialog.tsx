
import React from 'react';
import { Users, Heart, MapPin, Activity, Calendar, ArrowLeft } from 'lucide-react';
import { Group } from '@/types/groups';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { TAG_CATEGORIES } from '@/types/tags';

interface GroupDetailDialogProps {
  group: Group | null;
  isOpen: boolean;
  onClose: () => void;
  onJoin: (groupId: string) => void;
  userTags?: string[];
  isJoined?: boolean;
}

// Helper function to capitalize first letter of each word
const capitalizeWords = (str: string) => {
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

// Mock function for group health calculation
const getGroupHealth = (group: Group) => {
  const memberRatio = group.memberIds.length / group.memberLimit;
  const daysSinceCreated = Math.floor((Date.now() - new Date(group.createdDate).getTime()) / (1000 * 60 * 60 * 24));
  
  if (memberRatio > 0.7 && daysSinceCreated < 30) return { status: 'Excellent', color: 'text-green-600' };
  if (memberRatio > 0.4 && daysSinceCreated < 60) return { status: 'Good', color: 'text-blue-600' };
  if (memberRatio > 0.2) return { status: 'Fair', color: 'text-yellow-600' };
  return { status: 'Needs Growth', color: 'text-red-600' };
};

// Mock function for meetup frequency
const getMeetupFrequency = (group: Group) => {
  if (group.type === 'local-meetup') {
    return Math.floor(Math.random() * 4) + 1; // 1-4 times per month
  }
  return Math.floor(Math.random() * 8) + 4; // 4-12 times per month for online groups
};

const GroupDetailDialog = ({ group, isOpen, onClose, onJoin, userTags = [], isJoined = false }: GroupDetailDialogProps) => {
  if (!group) return null;

  const matchingTags = group.tags.filter(tag => userTags.includes(tag));
  const tagNames = new Map();
  TAG_CATEGORIES.forEach(category => {
    category.tags.forEach(tag => {
      tagNames.set(tag.id, capitalizeWords(tag.name));
    });
  });

  const groupHealth = getGroupHealth(group);
  const meetupFrequency = getMeetupFrequency(group);

  const handleJoinClick = () => {
    onJoin(group.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
        {/* Group Image */}
        {group.image && (
          <div className="relative h-48 -m-6 mb-0 overflow-hidden rounded-t-xl">
            <img 
              src={group.image} 
              alt={group.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            {/* Group Type Badge */}
            <Badge 
              variant="outline"
              className={`absolute top-4 right-4 text-xs px-3 py-1 border-0 font-medium backdrop-blur-md ${
                group.type === 'local-meetup' 
                  ? 'bg-green-500/90 text-white shadow-lg' 
                  : 'bg-blue-500/90 text-white shadow-lg'
              }`}
            >
              {group.type === 'local-meetup' ? 'Local' : 'Global'}
            </Badge>
          </div>
        )}

        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <DialogTitle className="text-2xl font-semibold text-gray-900">
                  {group.name}
                </DialogTitle>
                {matchingTags.length > 0 && (
                  <div className="flex items-center gap-1 text-pink-500">
                    <Heart size={16} fill="currentColor" />
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
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Group Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <Users size={16} />
              </div>
              <div className="font-semibold text-gray-900">{group.memberIds.length}</div>
              <div className="text-xs text-gray-500">Members</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <Activity size={16} />
              </div>
              <div className={`font-semibold ${groupHealth.color}`}>{groupHealth.status}</div>
              <div className="text-xs text-gray-500">Health</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <Calendar size={16} />
              </div>
              <div className="font-semibold text-gray-900">{meetupFrequency}x</div>
              <div className="text-xs text-gray-500">Per Month</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-xs text-gray-500 mb-1">Created</div>
              <div className="font-semibold text-gray-900 text-sm">
                {new Date(group.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">About this group</h3>
            <p className="text-gray-600 leading-relaxed">{group.description}</p>
          </div>

          {/* Tags */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {group.tags.map(tagId => (
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              <ArrowLeft size={16} className="mr-2" />
              Go Back
            </Button>
            
            {!isJoined && (
              <Button
                onClick={handleJoinClick}
                disabled={group.memberIds.length >= group.memberLimit}
                className="flex-1"
              >
                {group.memberIds.length >= group.memberLimit ? 'Group Full' : 'Request to Join'}
              </Button>
            )}
            
            {isJoined && (
              <Button
                variant="secondary"
                className="flex-1"
                disabled
              >
                Already Joined
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDetailDialog;
