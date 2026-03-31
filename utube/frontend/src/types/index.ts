// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "viewer" | "creator" | "admin";
}

// Video Types
export interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  viewsCount: number;
  likesCount: number;
  isLiked?: boolean;
  category: string;
  visibility: "public" | "private" | "unlisted";
  tags: string[];
  aiSummary?: string;
  creatorId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Comment Types
export interface Comment {
  _id: string;
  content: string;
  videoId: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  _id: string;
  userId: string;
  type: "NEW_VIDEO" | "NEW_COMMENT" | "NEW_LIKE" | "NEW_SUBSCRIBER";
  message: string;
  videoId?: string;
  isRead: boolean;
  createdAt: string;
}

// Watch History Types
export interface WatchHistory {
  _id: string;
  userId: string;
  videoId: {
    _id: string;
    title: string;
    thumbnailUrl: string;
    viewsCount: number;
    duration: number;
    creatorId: {
      name: string;
    };
  };
  watchedDuration: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Subscription Types
export interface Subscription {
  _id: string;
  subscriberId: string;
  creatorId: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  videos?: T[];
  comments?: T[];
  nextCursor: string | null;
  hasMore?: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  errors?: string[];
}
