
import { UserProfile, Post, Comment, Reaction, Friendship, ReactionType } from '@/types/social';

export interface ProfileState {
  profile: UserProfile | null;
  posts: Post[];
  pendingFriendRequests: Friendship[];
  friends: Friendship[];
  isLoading: boolean;
  isCurrentUser: boolean;
  friendshipStatus: 'none' | 'pending' | 'accepted' | 'requested';
}

export interface ProfileActions {
  createPost: (content: string, imageUrl?: string) => Promise<Post | null>;
  deletePost: (postId: string) => Promise<boolean>;
  addComment: (postId: string, content: string) => Promise<Comment | null>;
  addReaction: (type: ReactionType, postId?: string, commentId?: string) => Promise<Reaction | null>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile | null>;
  sendFriendRequest: (recipientId: string) => Promise<Friendship | null>;
  respondToFriendRequest: (requestId: string, accept: boolean) => Promise<Friendship | null>;
  deleteAccount: () => Promise<boolean>;
}

export type SocialProfileHook = ProfileState & ProfileActions;
