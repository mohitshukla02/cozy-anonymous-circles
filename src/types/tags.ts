
export interface Tag {
  id: string;
  name: string;
  category: string;
}

export interface TagCategory {
  id: string;
  name: string;
  color: string;
  tags: Tag[];
}

export const TAG_CATEGORIES: TagCategory[] = [
  {
    id: 'technology',
    name: 'Technology',
    color: 'bg-pastel-blue',
    tags: [
      { id: 'web-dev', name: 'Web Development', category: 'technology' },
      { id: 'ai-ml', name: 'AI/ML', category: 'technology' },
      { id: 'gaming', name: 'Gaming', category: 'technology' },
      { id: 'hardware', name: 'Hardware', category: 'technology' },
      { id: 'mobile-dev', name: 'Mobile Development', category: 'technology' },
      { id: 'cybersecurity', name: 'Cybersecurity', category: 'technology' },
      { id: 'data-science', name: 'Data Science', category: 'technology' },
      { id: 'blockchain', name: 'Blockchain', category: 'technology' },
    ]
  },
  {
    id: 'creative-arts',
    name: 'Creative Arts',
    color: 'bg-pastel-pink',
    tags: [
      { id: 'photography', name: 'Photography', category: 'creative-arts' },
      { id: 'writing', name: 'Writing', category: 'creative-arts' },
      { id: 'music-production', name: 'Music Production', category: 'creative-arts' },
      { id: 'digital-art', name: 'Digital Art', category: 'creative-arts' },
      { id: 'painting', name: 'Painting', category: 'creative-arts' },
      { id: 'filmmaking', name: 'Filmmaking', category: 'creative-arts' },
      { id: 'graphic-design', name: 'Graphic Design', category: 'creative-arts' },
      { id: 'pottery', name: 'Pottery', category: 'creative-arts' },
    ]
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    color: 'bg-pastel-green',
    tags: [
      { id: 'cooking', name: 'Cooking', category: 'lifestyle' },
      { id: 'fitness', name: 'Fitness', category: 'lifestyle' },
      { id: 'travel', name: 'Travel', category: 'lifestyle' },
      { id: 'fashion', name: 'Fashion', category: 'lifestyle' },
      { id: 'interior-design', name: 'Interior Design', category: 'lifestyle' },
      { id: 'minimalism', name: 'Minimalism', category: 'lifestyle' },
      { id: 'sustainable-living', name: 'Sustainable Living', category: 'lifestyle' },
      { id: 'urban-exploration', name: 'Urban Exploration', category: 'lifestyle' },
    ]
  },
  {
    id: 'intellectual',
    name: 'Intellectual',
    color: 'bg-pastel-beige',
    tags: [
      { id: 'books', name: 'Books', category: 'intellectual' },
      { id: 'philosophy', name: 'Philosophy', category: 'intellectual' },
      { id: 'science', name: 'Science', category: 'intellectual' },
      { id: 'history', name: 'History', category: 'intellectual' },
      { id: 'psychology', name: 'Psychology', category: 'intellectual' },
      { id: 'economics', name: 'Economics', category: 'intellectual' },
      { id: 'astronomy', name: 'Astronomy', category: 'intellectual' },
      { id: 'languages', name: 'Languages', category: 'intellectual' },
    ]
  },
  {
    id: 'social-causes',
    name: 'Social Causes',
    color: 'bg-green-100',
    tags: [
      { id: 'environment', name: 'Environment', category: 'social-causes' },
      { id: 'mental-health', name: 'Mental Health', category: 'social-causes' },
      { id: 'community-service', name: 'Community Service', category: 'social-causes' },
      { id: 'education', name: 'Education', category: 'social-causes' },
      { id: 'social-justice', name: 'Social Justice', category: 'social-causes' },
      { id: 'animal-welfare', name: 'Animal Welfare', category: 'social-causes' },
      { id: 'humanitarian', name: 'Humanitarian Work', category: 'social-causes' },
      { id: 'political-advocacy', name: 'Political Advocacy', category: 'social-causes' },
    ]
  },
  {
    id: 'hobbies',
    name: 'Hobbies',
    color: 'bg-orange-100',
    tags: [
      { id: 'board-games', name: 'Board Games', category: 'hobbies' },
      { id: 'gardening', name: 'Gardening', category: 'hobbies' },
      { id: 'diy', name: 'DIY Projects', category: 'hobbies' },
      { id: 'collecting', name: 'Collecting', category: 'hobbies' },
      { id: 'puzzles', name: 'Puzzles', category: 'hobbies' },
      { id: 'model-building', name: 'Model Building', category: 'hobbies' },
      { id: 'crafting', name: 'Crafting', category: 'hobbies' },
      { id: 'vintage-restoration', name: 'Vintage Restoration', category: 'hobbies' },
    ]
  },
  {
    id: 'sports-outdoors',
    name: 'Sports & Outdoors',
    color: 'bg-blue-100',
    tags: [
      { id: 'hiking', name: 'Hiking', category: 'sports-outdoors' },
      { id: 'cycling', name: 'Cycling', category: 'sports-outdoors' },
      { id: 'team-sports', name: 'Team Sports', category: 'sports-outdoors' },
      { id: 'rock-climbing', name: 'Rock Climbing', category: 'sports-outdoors' },
      { id: 'swimming', name: 'Swimming', category: 'sports-outdoors' },
      { id: 'camping', name: 'Camping', category: 'sports-outdoors' },
      { id: 'skiing', name: 'Skiing', category: 'sports-outdoors' },
      { id: 'surfing', name: 'Surfing', category: 'sports-outdoors' },
    ]
  },
  {
    id: 'wellness',
    name: 'Wellness',
    color: 'bg-purple-100',
    tags: [
      { id: 'meditation', name: 'Meditation', category: 'wellness' },
      { id: 'yoga', name: 'Yoga', category: 'wellness' },
      { id: 'self-improvement', name: 'Self-improvement', category: 'wellness' },
      { id: 'therapy', name: 'Therapy', category: 'wellness' },
      { id: 'mindfulness', name: 'Mindfulness', category: 'wellness' },
      { id: 'nutrition', name: 'Nutrition', category: 'wellness' },
      { id: 'sleep-health', name: 'Sleep Health', category: 'wellness' },
      { id: 'stress-management', name: 'Stress Management', category: 'wellness' },
    ]
  }
];
