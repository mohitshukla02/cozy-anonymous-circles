
import React from 'react';
import { Check } from 'lucide-react';
import { Tag } from '../types/tags';

interface TagSelectorProps {
  tag: Tag;
  isSelected: boolean;
  onToggle: (tagId: string) => void;
}

// Helper function to capitalize first letter of each word
const capitalizeWords = (str: string) => {
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

const TagSelector = ({ tag, isSelected, onToggle }: TagSelectorProps) => {
  return (
    <button
      onClick={() => onToggle(tag.id)}
      className={`
        relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
        border-2 hover:scale-105 shadow-sm hover:shadow-md
        ${isSelected 
          ? 'bg-amber-100 border-amber-300 text-amber-800' 
          : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
        }
      `}
    >
      <span className="flex items-center gap-2">
        {capitalizeWords(tag.name)}
        {isSelected && <Check size={14} className="text-amber-600" />}
      </span>
    </button>
  );
};

export default TagSelector;
