
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { TAG_CATEGORIES } from '../types/tags';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import TagSelector from '../components/TagSelector';

const TagOnboarding = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { user, updateTags, completeOnboarding } = useUser();
  const navigate = useNavigate();

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else if (selectedTags.length < 15) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleContinue = () => {
    if (selectedTags.length >= 5) {
      updateTags(selectedTags);
      completeOnboarding();
      navigate('/dashboard');
    }
  };

  const getSelectedTagNames = () => {
    const tagMap = new Map();
    TAG_CATEGORIES.forEach(category => {
      category.tags.forEach(tag => {
        tagMap.set(tag.id, tag.name);
      });
    });
    return selectedTags.map(id => tagMap.get(id));
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-gray-800 mb-4">
            Let's Find Your Tribe
          </h1>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Choose 5-15 interests that truly resonate with you. This helps us connect you with like-minded people 
            and suggest relevant groups for meaningful conversations.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">
              {selectedTags.length}/15 selected {selectedTags.length < 5 ? `(${5 - selectedTags.length} more needed)` : ''}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((selectedTags.length / 15) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tag Categories */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-soft p-6">
              <h2 className="text-xl font-heading font-semibold text-gray-800 mb-6">
                Choose Your Interests
              </h2>
              
              <Accordion type="multiple" className="space-y-4">
                {TAG_CATEGORIES.map((category) => (
                  <AccordionItem 
                    key={category.id} 
                    value={category.id}
                    className="border border-gray-200 rounded-2xl px-6"
                  >
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${category.color}`} />
                        <span className="font-medium text-gray-800">{category.name}</span>
                        <span className="text-xs text-gray-500">
                          ({category.tags.filter(tag => selectedTags.includes(tag.id)).length} selected)
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="flex flex-wrap gap-3">
                        {category.tags.map((tag) => (
                          <TagSelector
                            key={tag.id}
                            tag={tag}
                            isSelected={selectedTags.includes(tag.id)}
                            onToggle={handleTagToggle}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Selected Tags Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-soft p-6 sticky top-8">
              <h3 className="text-lg font-heading font-semibold text-gray-800 mb-4">
                Your Selected Interests
              </h3>
              
              {selectedTags.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  No interests selected yet. Choose at least 5 to continue.
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {getSelectedTagNames().map((tagName, index) => (
                      <span
                        key={index}
                        className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {tagName}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-600 border-t pt-3">
                    <p>✓ {selectedTags.length} interests selected</p>
                    {selectedTags.length < 5 && (
                      <p className="text-amber-600">Choose {5 - selectedTags.length} more to continue</p>
                    )}
                    {selectedTags.length >= 15 && (
                      <p className="text-amber-600">Maximum reached (15)</p>
                    )}
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={selectedTags.length < 5}
                className={`
                  w-full mt-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all
                  ${selectedTags.length >= 5
                    ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <span>Continue to Dashboard</span>
                <ArrowRight size={20} />
              </button>

              <button
                onClick={() => navigate('/signup')}
                className="w-full mt-3 text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft size={16} />
                <span>Back to Signup</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagOnboarding;
