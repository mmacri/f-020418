
import { useState, useEffect } from 'react';
import { useProfileData } from './useProfileData';
import { useProfilePosts } from './useProfilePosts';
import { useProfileFriends } from './useProfileFriends';
import { useProfileBookmarks } from './useProfileBookmarks';
import { usePostActions } from './usePostActions';
import { useFriendActions } from './useFriendActions';
import { useProfileActions } from './useProfileActions';
import { useAdminSocialAccess } from './useAdminSocialAccess';
import { SocialProfileHook } from './types';
import { useAuthentication } from '@/hooks/useAuthentication';

export const useSocialProfile = (userId?: string): SocialProfileHook => {
  const { isAdmin } = useAuthentication();
  const { hasAccess: adminHasAccess, error: adminAccessError } = useAdminSocialAccess();
  const [error, setError] = useState<string | null>(null);

  // If admin but no ID is provided, we're likely on the admin's own profile page
  const targetUserId = userId || undefined;

  // Get profile data
  const {
    profile,
    isLoading: profileLoading,
    isCurrentUser,
    friendshipStatus,
    refetchProfile,
    error: profileError
  } = useProfileData(targetUserId);

  // Get posts data
  const {
    posts,
    isLoading: postsLoading,
    refetchPosts
  } = useProfilePosts(targetUserId);

  // Get friends data
  const {
    friends,
    pendingFriendRequests,
    isLoading: friendsLoading,
    refetchFriends
  } = useProfileFriends(targetUserId, isCurrentUser || (isAdmin && adminHasAccess));

  // Get bookmarks data
  const {
    bookmarks,
    isLoading: bookmarksLoading,
    refetchBookmarks
  } = useProfileBookmarks(targetUserId, isCurrentUser || (isAdmin && adminHasAccess));

  // Post actions
  const {
    createPost,
    deletePost,
    addComment,
    addReaction,
    bookmarkPost,
    isBookmarked,
    isUploading: isPostUploading
  } = usePostActions(profile, () => {
    refetchPosts();
    refetchBookmarks();
  });

  // Friend actions
  const {
    sendFriendRequest,
    respondToFriendRequest
  } = useFriendActions(friendshipStatus, refetchFriends);

  // Profile actions
  const {
    updateProfile,
    deleteAccount,
    isUploading: isProfileUploading
  } = useProfileActions(profile, (updatedProfile) => {
    if (updatedProfile) {
      refetchProfile();
    }
  });

  // Combined loading state
  const isLoading = profileLoading || postsLoading || friendsLoading || bookmarksLoading;
  const isUploading = isPostUploading || isProfileUploading;

  // Combine errors
  useEffect(() => {
    if (profileError) {
      setError(profileError);
    } else if (adminAccessError && isAdmin) {
      setError(adminAccessError);
    } else {
      setError(null);
    }
  }, [profileError, adminAccessError, isAdmin]);

  return {
    // Profile state
    profile,
    posts,
    pendingFriendRequests,
    friends,
    bookmarks,
    isLoading,
    isCurrentUser,
    friendshipStatus,
    error,

    // Actions
    createPost,
    deletePost,
    addComment,
    addReaction,
    updateProfile,
    sendFriendRequest,
    respondToFriendRequest,
    bookmarkPost,
    isBookmarked,
    deleteAccount,
    isUploading
  };
};
