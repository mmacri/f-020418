
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
  const { isAdmin, user } = useAuthentication();
  const { hasAccess: adminHasAccess, error: adminAccessError } = useAdminSocialAccess();
  const [error, setError] = useState<string | null>(null);

  // Check if this is the special super admin account that shouldn't have a social profile
  const isSuperAdmin = isAdmin && user?.email === 'admin@recoveryessentials.com';
  
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

  // Friend actions - Call without any arguments
  const {
    sendFriendRequest,
    respondToFriendRequest
  } = useFriendActions();

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
    if (isSuperAdmin && !profile) {
      setError("This admin account is a super admin and doesn't have a social profile. It's designed to manage all social profiles.");
    } else if (profileError) {
      setError(profileError);
    } else if (adminAccessError && isAdmin) {
      setError(adminAccessError);
    } else {
      setError(null);
    }
  }, [profileError, adminAccessError, isAdmin, isSuperAdmin, profile]);

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
