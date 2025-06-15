
export interface Group {
  id: string;
  name: string;
  description: string;
  image?: string;
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
  status?: 'active' | 'warning' | 'final_warning' | 'archived';
  warning_level?: 'none' | 'week2' | 'week1' | 'final';
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

// New meetup-related types
export interface Meetup {
  id: string;
  groupId: string;
  creatorId: string;
  title: string;
  description?: string;
  dateTime: string;
  location: string;
  purpose: string;
  status: 'planned' | 'successful' | 'failed' | 'cancelled';
  rsvpCount: number;
  checkinCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MeetupRSVP {
  id: string;
  meetupId: string;
  userId: string;
  status: 'attending' | 'not_attending' | 'suggest_new_time';
  checkedIn: boolean;
  checkinTime?: string;
  createdAt: string;
}

export interface MeetupRecap {
  id: string;
  meetupId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  payload?: any;
  readAt?: string;
  channel: 'in-app' | 'push' | 'email';
  createdAt: string;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  meetupNotifications: 'push' | 'email' | 'silent';
  rsvpNotifications: 'push' | 'email' | 'silent';
  warningNotifications: 'push' | 'email' | 'silent';
  recapNotifications: 'push' | 'email' | 'silent';
  createdAt: string;
  updatedAt: string;
}
