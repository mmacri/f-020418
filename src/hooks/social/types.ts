
import { UserProfile, Post, Comment, Reaction, Friendship, ReactionType, Bookmark } from '@/types/social';

export interface ProfileState {
  profile: UserProfile | null;
  posts: Post[];
  pendingFriendRequests: Friendship[];
  friends: Friendship[];
  bookmarks: Bookmark[];
  isLoading: boolean;
  isCurrentUser: boolean;
  friendshipStatus: 'none' | 'pending' | 'accepted' | 'requested';
}

export interface ProfileActions {
  createPost: (content: string, imageFile?: File, imageUrl?: string) => Promise<Post | null>;
  deletePost: (postId: string) => Promise<boolean>;
  addComment: (postId: string, content: string) => Promise<Comment | null>;
  addReaction: (type: ReactionType, postId?: string, commentId?: string) => Promise<Reaction | null>;
  updateProfile: (updates: Partial<UserProfile>, avatarFile?: File) => Promise<UserProfile | null>;
  sendFriendRequest: (recipientId: string) => Promise<Friendship | null>;
  respondToFriendRequest: (requestId: string, accept: boolean) => Promise<Friendship | null>;
  bookmarkPost: (postId: string) => Promise<boolean>;
  isBookmarked: (postId: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
}

export type SocialProfileHook = ProfileState & ProfileActions & {
  isUploading: boolean;
};
