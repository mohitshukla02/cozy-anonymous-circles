
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TAG_CATEGORIES } from '@/types/tags';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/useUserProfile';

const TagOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile, loading } = useUserProfile();
  const [selectedTags, setSelectedTags] = useState<string[]>(profile?.selected_tags || []);

  console.log('TagOnboarding - Profile:', profile);
  console.log('TagOnboarding - Selected tags:', selectedTags);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error('No user found');
      return;
    }

    console.log('Submitting tags:', selectedTags);
    
    try {
      const success = await updateProfile({ selected_tags: selectedTags });
      if (success) {
        console.log('Tags updated successfully');
        navigate('/dashboard');
      } else {
        console.error('Failed to update tags');
      }
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-32 w-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Interests</h1>
          <p className="text-gray-600 text-lg">
            Select topics you're passionate about to find relevant groups and connect with like-minded people.
          </p>
        </div>

        <div className="space-y-8">
          {TAG_CATEGORIES.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "secondary"}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedTags.includes(tag.id)
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="px-8 py-2"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedTags.length === 0}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700"
          >
            Continue with {selectedTags.length} interest{selectedTags.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TagOnboarding;
