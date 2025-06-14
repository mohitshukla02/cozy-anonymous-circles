
const ADJECTIVES = [
  'Curious', 'Gentle', 'Wise', 'Brave', 'Calm', 'Creative', 'Dreamy', 'Eager',
  'Friendly', 'Grateful', 'Happy', 'Inspiring', 'Joyful', 'Kind', 'Lively',
  'Mindful', 'Noble', 'Optimistic', 'Peaceful', 'Quiet', 'Radiant', 'Serene',
  'Thoughtful', 'Understanding', 'Vibrant', 'Warm', 'Zealous', 'Authentic',
  'Compassionate', 'Genuine', 'Honest', 'Patient', 'Sincere', 'Trusting'
];

const NOUNS = [
  'Owl', 'Fox', 'Deer', 'Robin', 'Sparrow', 'Turtle', 'Bear', 'Wolf',
  'Rabbit', 'Squirrel', 'Butterfly', 'Dolphin', 'Elephant', 'Giraffe',
  'Hedgehog', 'Koala', 'Panda', 'Penguin', 'Seal', 'Swan', 'Tiger',
  'Whale', 'Zebra', 'Eagle', 'Falcon', 'Heron', 'Wren', 'Dove',
  'Peacock', 'Cardinal', 'Finch', 'Hummingbird', 'Starling'
];

export const generateRandomUsername = (): string => {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const numbers = Math.floor(Math.random() * 900) + 100; // 3-digit number
  
  return `${adjective}${noun}${numbers}`;
};
