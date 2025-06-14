
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
  avatar?: string;
  pinnedPostId?: string;
}

export interface Post {
  id: string;
  groupId: string;
  authorId: string;
  content: string;
  timestamp: string;
  likes: string[];
  editedAt?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  timestamp: string;
  parentCommentId?: string;
  likes: string[];
}

export interface UserGroup {
  userId: string;
  groupId: string;
  joinDate: string;
  role: 'admin' | 'member';
  anonymousName: string;
}
