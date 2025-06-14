
import React, { useState, useEffect } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TAG_CATEGORIES } from '../types/tags';
import TagSelector from '../components/TagSelector';
import { useUserProfile } from '@/hooks/useUserProfile';
import { updateUserTags } from '@/utils/userProfileStorage';
import { useAuth } from '@/contexts/AuthContext';

const TagOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading, refreshProfile } = useUserProfile();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing tags when profile is available
  useEffect(() => {
    if (profile?.selected_tags) {
      console.log('Loading existing tags:', profile.selected_tags);
      setSelectedTags(profile.selected_tags);
    }
  }, [profile]);

  const toggleTag = (tagId: string) => {
    console.log('Toggling tag:', tagId);
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else if (selectedTags.length < 10) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleContinue = async () => {
    if (!user || selectedTags.length < 3) return;
    
    setIsLoading(true);
    console.log('Saving tags:', selectedTags);
    
    try {
      const success = await updateUserTags(user.id, selectedTags);
      
      if (success) {
        console.log('Tags saved successfully');
        await refreshProfile(); // Refresh the profile to get updated data
        navigate('/dashboard');
      } else {
        console.error('Failed to save tags');
        alert('Failed to save your interests. Please try again.');
      }
    } catch (error) {
      console.error('Error saving tags:', error);
      alert('An error occurred while saving your interests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-64 rounded mb-4"></div>
          <div className="bg-gray-200 h-4 w-96 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
            What interests you?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose topics you're passionate about to find your perfect communities. 
            Select at least 3 interests to get started.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <div className="w-8 h-1 bg-amber-500 rounded"></div>
            <div className="w-3 h-3 bg-amber-200 rounded-full"></div>
          </div>
        </div>

        {/* Tag Categories */}
        <div className="space-y-8 mb-12">
          {TAG_CATEGORIES.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl p-6 shadow-soft">
              <h2 className="text-xl font-heading font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-3">{category.emoji}</span>
                {category.name}
              </h2>
              <div className="flex flex-wrap gap-3">
                {category.tags.map((tag) => (
                  <TagSelector
                    key={tag.id}
                    tag={tag}
                    isSelected={selectedTags.includes(tag.id)}
                    onToggle={toggleTag}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selection summary and continue button */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Your Interests ({selectedTags.length}/10)
              </h3>
              <p className="text-gray-600 text-sm">
                {selectedTags.length < 3 
                  ? `Select ${3 - selectedTags.length} more to continue`
                  : 'Great! You can add more or continue to your dashboard.'
                }
              </p>
            </div>
            <button
              onClick={handleContinue}
              disabled={selectedTags.length < 3 || isLoading}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all
                ${selectedTags.length >= 3 && !isLoading
                  ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>{profile?.selected_tags?.length ? 'Update' : 'Continue'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {selectedTags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tagId) => {
                  const tag = TAG_CATEGORIES
                    .flatMap(cat => cat.tags)
                    .find(t => t.id === tagId);
                  return tag ? (
                    <span
                      key={tagId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800"
                    >
                      <Check size={14} className="mr-1" />
                      {tag.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Skip option */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagOnboarding;
