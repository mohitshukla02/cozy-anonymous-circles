
import { Group, Post, Comment, UserGroup } from '../types/groups';

const GROUPS_KEY = 'cozy_groups';
const POSTS_KEY = 'cozy_posts';
const COMMENTS_KEY = 'cozy_comments';
const USER_GROUPS_KEY = 'cozy_user_groups';

// Anonymous name generator for consistent group identities
const ANIMALS = ['Owl', 'Fox', 'Bear', 'Wolf', 'Deer', 'Rabbit', 'Cat', 'Bird', 'Fish', 'Butterfly'];
const ADJECTIVES = ['Wise', 'Gentle', 'Brave', 'Kind', 'Calm', 'Bright', 'Swift', 'Quiet', 'Warm', 'Clever'];

export const generateAnonymousName = (userId: string, groupId: string): string => {
  const seed = userId + groupId;
  const hash = seed.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const adjective = ADJECTIVES[Math.abs(hash) % ADJECTIVES.length];
  const animal = ANIMALS[Math.abs(hash >> 8) % ANIMALS.length];
  const number = Math.abs(hash) % 100;
  
  return `${adjective}${animal}${number}`;
};

export const getGroups = (): Group[] => {
  const stored = localStorage.getItem(GROUPS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveGroups = (groups: Group[]): void => {
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
};

export const getPosts = (): Post[] => {
  const stored = localStorage.getItem(POSTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const savePosts = (posts: Post[]): void => {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

export const getComments = (): Comment[] => {
  const stored = localStorage.getItem(COMMENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveComments = (comments: Comment[]): void => {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
};

export const getUserGroups = (): UserGroup[] => {
  const stored = localStorage.getItem(USER_GROUPS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveUserGroups = (userGroups: UserGroup[]): void => {
  localStorage.setItem(USER_GROUPS_KEY, JSON.stringify(userGroups));
};

export const createSampleGroups = (): void => {
  const existingGroups = getGroups();
  if (existingGroups.length > 0) return;

  const sampleGroups: Group[] = [
    {
      id: '1',
      name: 'Digital Art Creators',
      description: 'A cozy space for digital artists to share techniques, get feedback, and inspire each other.',
      tags: ['digital-art', 'creative-arts', 'graphic-design'],
      memberIds: ['sample1', 'sample2', 'sample3'],
      createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      memberLimit: 30,
      privacy: 'open',
      adminId: 'sample1',
    },
    {
      id: '2',
      name: 'Mindful Morning Routines',
      description: 'Start your day right! Share morning rituals, meditation tips, and wellness practices.',
      tags: ['mindfulness', 'wellness', 'meditation'],
      memberIds: ['sample1', 'sample4', 'sample5', 'sample6'],
      createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      memberLimit: 25,
      privacy: 'open',
      adminId: 'sample4',
    },
    {
      id: '3',
      name: 'Sustainable Living Tips',
      description: 'Small changes, big impact. Share eco-friendly lifestyle tips and sustainable practices.',
      tags: ['sustainable-living', 'environment', 'lifestyle'],
      memberIds: ['sample2', 'sample7'],
      createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      memberLimit: 40,
      privacy: 'open',
      adminId: 'sample2',
    }
  ];

  saveGroups(sampleGroups);
};
