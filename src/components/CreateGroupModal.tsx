
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { TAG_CATEGORIES } from '../types/tags';
import LocationSelector from './LocationSelector';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (groupData: {
    name: string;
    description: string;
    tags: string[];
    memberLimit: number;
    privacy: 'open' | 'invitation';
    type: 'interest' | 'local-meetup';
    location?: {
      city: string;
      region: string;
      coordinates?: { lat: number; lng: number };
    };
  }) => void;
  userTags: string[];
  userLocation?: {
    city: string;
    region: string;
    coordinates?: { lat: number; lng: number };
  };
}

const CreateGroupModal = ({ isOpen, onClose, onCreate, userTags, userLocation }: CreateGroupModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [memberLimit, setMemberLimit] = useState(30);
  const [privacy, setPrivacy] = useState<'open' | 'invitation'>('open');
  const [groupType, setGroupType] = useState<'interest' | 'local-meetup'>('interest');
  const [groupLocation, setGroupLocation] = useState(userLocation);
  const [locationError, setLocationError] = useState('');

  // If userTags is empty, use all available tags, otherwise use userTags
  const availableTags = userTags.length > 0 ? userTags : TAG_CATEGORIES.flatMap(category => category.tags.map(tag => tag.id));
  
  const tagNames = new Map();
  TAG_CATEGORIES.forEach(category => {
    category.tags.forEach(tag => {
      tagNames.set(tag.id, tag.name);
    });
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocationError('');

    // Basic validation
    if (!name.trim() || !description.trim() || selectedTags.length < 3) {
      return;
    }

    // Location validation for local meetup groups
    if (groupType === 'local-meetup') {
      if (!groupLocation || !groupLocation.city || !groupLocation.region) {
        setLocationError('Location is required for local meetup groups');
        return;
      }
    }

    console.log('Creating group with data:', {
      name: name.trim(),
      description: description.trim(),
      tags: selectedTags,
      memberLimit: groupType === 'local-meetup' ? Math.min(memberLimit, 20) : memberLimit,
      privacy,
      type: groupType,
      location: groupType === 'local-meetup' ? groupLocation : undefined
    });

    onCreate({
      name: name.trim(),
      description: description.trim(),
      tags: selectedTags,
      memberLimit: groupType === 'local-meetup' ? Math.min(memberLimit, 20) : memberLimit,
      privacy,
      type: groupType,
      location: groupType === 'local-meetup' ? groupLocation : undefined
    });
    
    // Reset form
    setName('');
    setDescription('');
    setSelectedTags([]);
    setMemberLimit(30);
    setPrivacy('open');
    setGroupType('interest');
    setGroupLocation(userLocation);
    setLocationError('');
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleLocationSelect = (location: { city: string; region: string; coordinates?: { lat: number; lng: number } }) => {
    console.log('Location selected:', location);
    setGroupLocation(location);
    setLocationError('');
  };

  const handleGroupTypeChange = (type: 'interest' | 'local-meetup') => {
    setGroupType(type);
    setLocationError('');
    // Reset location when switching to interest group
    if (type === 'interest') {
      setGroupLocation(undefined);
    } else {
      // Set to user location if available when switching to local meetup
      setGroupLocation(userLocation);
    }
  };

  if (!isOpen) return null;

  const isFormValid = name.trim() && 
                     description.trim() && 
                     selectedTags.length >= 3 &&
                     (groupType === 'interest' || (groupType === 'local-meetup' && groupLocation?.city && groupLocation?.region));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-heading font-semibold text-gray-800">
            Create New Group
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleGroupTypeChange('interest')}
                className={`p-3 rounded-lg border text-sm transition-all ${
                  groupType === 'interest'
                    ? 'bg-blue-50 border-blue-300 text-blue-800'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">Global Community</div>
                <div className="text-xs mt-1">Online discussions</div>
              </button>
              <button
                type="button"
                onClick={() => handleGroupTypeChange('local-meetup')}
                className={`p-3 rounded-lg border text-sm transition-all ${
                  groupType === 'local-meetup'
                    ? 'bg-green-50 border-green-300 text-green-800'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">Local Meetup</div>
                <div className="text-xs mt-1">City-based group</div>
              </button>
            </div>
          </div>

          {groupType === 'local-meetup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <LocationSelector
                onLocationSelect={handleLocationSelect}
                selectedLocation={groupLocation}
              />
              {locationError && (
                <p className="text-sm text-red-600 mt-1">{locationError}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 50))}
              placeholder="Enter group name..."
              maxLength={50}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">{name.length}/50 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              placeholder="Describe what your group is about..."
              maxLength={200}
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/200 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Tags <span className="text-red-500">*</span> (3-5 required)
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-md">
              {availableTags.map(tagId => (
                <button
                  key={tagId}
                  type="button"
                  onClick={() => toggleTag(tagId)}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    selectedTags.includes(tagId)
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tagNames.get(tagId) || tagId}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {selectedTags.length}/5 selected (minimum 3 required)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Limit
            </label>
            <Input
              type="number"
              value={memberLimit}
              onChange={(e) => {
                const maxLimit = groupType === 'local-meetup' ? 20 : 50;
                setMemberLimit(Math.min(maxLimit, Math.max(5, parseInt(e.target.value) || 30)));
              }}
              min={5}
              max={groupType === 'local-meetup' ? 20 : 50}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              {groupType === 'local-meetup' 
                ? 'Keep meetups intimate: 5-20 members' 
                : 'Interest communities: 5-50 members'
              }
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Privacy Setting
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="privacy"
                  value="open"
                  checked={privacy === 'open'}
                  onChange={(e) => setPrivacy(e.target.value as 'open')}
                  className="mr-2"
                />
                <span className="text-sm">Open to join</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="privacy"
                  value="invitation"
                  checked={privacy === 'invitation'}
                  onChange={(e) => setPrivacy(e.target.value as 'invitation')}
                  className="mr-2"
                />
                <span className="text-sm">Invitation only</span>
              </label>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <h4 className="font-medium text-amber-800 text-sm mb-2">Community Guidelines</h4>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Be respectful and kind to all members</li>
              <li>• Stay on topic and contribute meaningfully</li>
              <li>• No spam, self-promotion, or harmful content</li>
              <li>• Maintain the cozy, welcoming atmosphere</li>
              {groupType === 'local-meetup' && (
                <li>• Always suggest public meeting places for safety</li>
              )}
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              Create Group
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
