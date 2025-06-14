
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

// New functions for post and comment management
export const createPost = (groupId: string, authorId: string, content: string): Post => {
  const newPost: Post = {
    id: Date.now().toString(),
    groupId,
    authorId,
    content,
    timestamp: new Date().toISOString(),
    likes: []
  };
  
  const posts = getPosts();
  posts.push(newPost);
  savePosts(posts);
  
  return newPost;
};

export const likePost = (postId: string, userId: string): void => {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  
  if (post) {
    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }
    savePosts(posts);
  }
};

export const createComment = (postId: string, authorId: string, content: string, parentCommentId?: string): Comment => {
  const newComment: Comment = {
    id: Date.now().toString(),
    postId,
    authorId,
    content,
    timestamp: new Date().toISOString(),
    likes: [],
    ...(parentCommentId && { parentCommentId })
  };
  
  const comments = getComments();
  comments.push(newComment);
  saveComments(comments);
  
  return newComment;
};

export const likeComment = (commentId: string, userId: string): void => {
  const comments = getComments();
  const comment = comments.find(c => c.id === commentId);
  
  if (comment) {
    const likeIndex = comment.likes.indexOf(userId);
    if (likeIndex === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(likeIndex, 1);
    }
    saveComments(comments);
  }
};

export const createSampleGroups = () => {
  const existingGroups = getGroups();
  if (existingGroups.length > 0) return;

  const sampleGroups: Group[] = [
    // Interest Communities (Global)
    {
      id: '1',
      name: 'Photography Enthusiasts',
      description: 'Share your best shots, get feedback, and learn new techniques from fellow photographers.',
      tags: ['photography', 'art', 'creativity'],
      memberIds: ['user1', 'user2'],
      createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      memberLimit: 50,
      privacy: 'open',
      adminId: 'user1',
      type: 'interest'
    },
    {
      id: '2',
      name: 'Book Lovers Circle',
      description: 'Monthly book discussions, reading recommendations, and literary conversations.',
      tags: ['books', 'reading', 'literature'],
      memberIds: ['user2'],
      createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      memberLimit: 40,
      privacy: 'open',
      adminId: 'user2',
      type: 'interest'
    },
    {
      id: '3',
      name: 'Cooking Adventures',
      description: 'Share recipes, cooking tips, and food photos. From beginners to master chefs!',
      tags: ['cooking', 'food', 'recipes'],
      memberIds: ['user3'],
      createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      memberLimit: 45,
      privacy: 'open',
      adminId: 'user3',
      type: 'interest'
    },
    
    // Local Meetup Groups
    {
      id: '4',
      name: 'SF Bay Area Hikers',
      description: 'Weekly hiking meetups exploring the beautiful trails around San Francisco.',
      tags: ['hiking', 'outdoors', 'fitness'],
      memberIds: ['user4'],
      createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      memberLimit: 15,
      privacy: 'open',
      adminId: 'user4',
      type: 'local-meetup',
      location: {
        city: 'San Francisco',
        region: 'California',
        coordinates: { lat: 37.7749, lng: -122.4194 }
      }
    },
    {
      id: '5',
      name: 'Brooklyn Board Game Club',
      description: 'Friendly board game nights every Tuesday. All skill levels welcome!',
      tags: ['games', 'social', 'strategy'],
      memberIds: ['user5'],
      createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      memberLimit: 12,
      privacy: 'open',
      adminId: 'user5',
      type: 'local-meetup',
      location: {
        city: 'Brooklyn',
        region: 'New York',
        coordinates: { lat: 40.6782, lng: -73.9442 }
      }
    },
    {
      id: '6',
      name: 'Austin Coffee Enthusiasts',
      description: 'Exploring the best coffee shops and roasters in Austin. Weekend coffee walks!',
      tags: ['coffee', 'food', 'social'],
      memberIds: ['user6'],
      createdDate: new Date().toISOString(),
      memberLimit: 18,
      privacy: 'open',
      adminId: 'user6',
      type: 'local-meetup',
      location: {
        city: 'Austin',
        region: 'Texas',
        coordinates: { lat: 30.2672, lng: -97.7431 }
      }
    }
  ];

  saveGroups(sampleGroups);
};
