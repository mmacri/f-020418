
import { useState, useEffect } from 'react';
import { useProfileData } from './useProfileData';
import { useProfilePosts } from './useProfilePosts';
import { useProfileFriends } from './useProfileFriends';
import { useProfileBookmarks } from './useProfileBookmarks';
import { usePostActions } from './usePostActions';
import { useProfileActions } from './useProfileActions';
import { useFriendActions } from './useFriendActions';
import { SocialProfileHook } from './types';
import { Post, Comment, Reaction, ReactionType } from '@/types/social';

export const useSocialProfile = (userId?: string): SocialProfileHook => {
  const [isUploading, setIsUploading] = useState(false);
  
  // Get basic profile data
  const {
    profile,
    isLoading: isProfileLoading,
    isCurrentUser,
    friendshipStatus,
    refetchProfile
  } = useProfileData(userId);

  // Get posts data
  const {
    posts,
    isLoading: isPostsLoading,
    refetchPosts
  } = useProfilePosts(userId);
  
  // Get friends data
  const {
    friends,
    pendingFriendRequests,
    isLoading: isFriendsLoading,
    refetchFriends
  } = useProfileFriends(userId, isCurrentUser);
  
  // Get bookmarks data
  const {
    bookmarks,
    isLoading: isBookmarksLoading,
    refetchBookmarks
  } = useProfileBookmarks(userId, isCurrentUser);
  
  // Derive overall loading state
  const isLoading = isProfileLoading || isPostsLoading || 
                    isFriendsLoading || isBookmarksLoading;

  // Get post actions
  const postActions = usePostActions();
  
  // Get profile actions
  const profileActions = useProfileActions(profile, () => {
    refetchProfile();
  });
  
  // Get friend actions
  const friendActions = useFriendActions(friendshipStatus, () => {
    refetchProfile();
    refetchFriends();
  });

  // Track uploading state from both actions
  useEffect(() => {
    setIsUploading(postActions.isUploading || profileActions.isUploading);
  }, [postActions.isUploading, profileActions.isUploading]);

  // Combined post creating function that updates the UI
  const createPost = async (content: string, imageFile?: File, imageUrl?: string): Promise<Post | null> => {
    const newPost = await postActions.createPost(content, imageFile, imageUrl);
    if (newPost) {
      refetchPosts();
    }
    return newPost;
  };

  // Combined post deletion function that updates the UI
  const deletePost = async (postId: string): Promise<boolean> => {
    const success = await postActions.deletePost(postId);
    if (success) {
      refetchPosts();
    }
    return success;
  };

  // Combined comment adding function that updates the UI
  const addComment = async (postId: string, content: string): Promise<Comment | null> => {
    const newComment = await postActions.addComment(postId, content);
    if (newComment) {
      refetchPosts();
      refetchBookmarks(); // Refresh bookmarks too as they contain posts
    }
    return newComment;
  };

  // Combined reaction function that updates the UI
  const addReaction = async (type: ReactionType, postId?: string, commentId?: string): Promise<Reaction | null> => {
    const newReaction = await postActions.addReaction(type, postId, commentId);
    if (newReaction) {
      refetchPosts();
      refetchBookmarks(); // Refresh bookmarks too as they contain posts
    }
    return newReaction;
  };

  // Bookmark post function
  const bookmarkPost = async (postId: string): Promise<boolean> => {
    const result = await postActions.bookmarkPost(postId);
    if (result) {
      refetchBookmarks();
    }
    return result;
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
    isBookmarked: postActions.isBookmarked,
    
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
