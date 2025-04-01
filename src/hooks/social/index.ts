
import { useState, useEffect } from 'react';
import { useProfileData } from './useProfileData';
import { usePostActions } from './usePostActions';
import { useProfileActions } from './useProfileActions';
import { useFriendActions } from './useFriendActions';
import { SocialProfileHook } from './types';
import { UserProfile, Post, Comment, Reaction, Friendship, ReactionType, Bookmark } from '@/types/social';

export const useSocialProfile = (userId?: string): SocialProfileHook => {
  const [isUploading, setIsUploading] = useState(false);
  
  // Get basic profile data
  const {
    profile,
    posts,
    pendingFriendRequests,
    friends,
    bookmarks,
    isLoading,
    isCurrentUser,
    friendshipStatus,
    refetchProfile
  } = useProfileData(userId);

  // Get post actions
  const postActions = usePostActions();
  
  // Get profile actions
  const profileActions = useProfileActions(profile, () => {
    refetchProfile();
  });
  
  // Get friend actions
  const friendActions = useFriendActions(friendshipStatus, () => {
    refetchProfile();
  });

  // Track uploading state from both actions
  useEffect(() => {
    setIsUploading(postActions.isUploading || profileActions.isUploading);
  }, [postActions.isUploading, profileActions.isUploading]);

  // Combined post creating function that updates the UI
  const createPost = async (content: string, imageFile?: File, imageUrl?: string): Promise<Post | null> => {
    const newPost = await postActions.createPost(content, imageFile, imageUrl);
    if (newPost) {
      refetchProfile();
    }
    return newPost;
  };

  // Combined post deletion function that updates the UI
  const deletePost = async (postId: string): Promise<boolean> => {
    const success = await postActions.deletePost(postId);
    if (success) {
      refetchProfile();
    }
    return success;
  };

  // Combined comment adding function that updates the UI
  const addComment = async (postId: string, content: string): Promise<Comment | null> => {
    const newComment = await postActions.addComment(postId, content);
    if (newComment) {
      refetchProfile();
    }
    return newComment;
  };

  // Combined reaction function that updates the UI
  const addReaction = async (type: ReactionType, postId?: string, commentId?: string): Promise<Reaction | null> => {
    const newReaction = await postActions.addReaction(type, postId, commentId);
    refetchProfile();
    return newReaction;
  };

  // Bookmark post function
  const bookmarkPost = async (postId: string): Promise<boolean> => {
    const result = await postActions.bookmarkPost(postId);
    refetchProfile();
    return result;
  };

  // Check if post is bookmarked function
  const isBookmarked = async (postId: string): Promise<boolean> => {
    return await postActions.isBookmarked(postId);
  };

  return {
    // State
    profile,
    posts,
    pendingFriendRequests,
    friends,
    bookmarks,
    isLoading,
    isCurrentUser,
    friendshipStatus,
    isUploading,
    
    // Post actions
    createPost,
    deletePost,
    addComment,
    addReaction,
    bookmarkPost,
    isBookmarked,
    
    // Profile actions
    updateProfile: profileActions.updateProfile,
    deleteAccount: profileActions.deleteAccount,
    
    // Friend actions
    sendFriendRequest: friendActions.sendFriendRequest,
    respondToFriendRequest: friendActions.respondToFriendRequest
  };
};

// Re-export types for convenience
export type { SocialProfileHook } from './types';
export type { UserProfile, Post, Comment, Reaction, Friendship, ReactionType, Bookmark } from '@/types/social';
