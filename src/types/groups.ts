
export interface Group {
  id: string;
  name: string;
  description: string;
  tags: string[];
  memberIds: string[];
  createdDate: string;
  memberLimit: number;
  privacy: 'open' | 'invitation';
  adminId: string;
  type: 'interest' | 'local-meetup';
  locationCity?: string;
  locationRegion?: string;
  isArchived: boolean;
  lastMeetupDate?: string;
  meetupDeadline?: string;
}

export interface Post {
  id: string;
  authorId: string;
  groupId: string;
  content: string;
  createdAt: string;
  editedAt?: string;
  likes: string[];
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  likes: string[];
}

export interface UserGroup {
  id: string;
  userId: string;
  groupId: string;
  role: 'admin' | 'member';
  joinDate: string;
  anonymousName: string;
}
