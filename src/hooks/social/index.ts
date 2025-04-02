
import { useProfileData } from './useProfileData';
import { useProfileActions } from './useProfileActions';
import { usePostActions } from './usePostActions';
import { useFriendActions } from './useFriendActions';
import { useAdminSocialAccess } from './useAdminSocialAccess';
import { useEnsureAdminProfile } from './useEnsureAdminProfile';
import { useProfilePosts } from './useProfilePosts';
import { useProfileFriends } from './useProfileFriends';
import { useProfileBookmarks } from './useProfileBookmarks';

// Combine all hooks into a unified API
export function useSocialProfile(userId?: string) {
  const profileData = useProfileData(userId);
  const { profile, isCurrentUser, friendshipStatus, isLoading, error, refetchProfile } = profileData;
  const { updateProfile, deleteAccount, isUploading } = useProfileActions(profile, refetchProfile);
  const { posts, refetchPosts } = useProfilePosts(userId);
  const { friends, pendingFriendRequests, refetchFriends } = useProfileFriends(userId, isCurrentUser);
  const { bookmarks, refetchBookmarks } = useProfileBookmarks(userId, isCurrentUser);
  const postActions = usePostActions();
  const friendActions = useFriendActions();
  
  return {
    // Profile data
    profile,
    isCurrentUser,
    friendshipStatus,
    isLoading,
    error,
    
    // Profile collections
    posts,
    friends,
    pendingFriendRequests,
    bookmarks,
    
    // Profile actions
    updateProfile,
    deleteAccount,
    isUploading,
    
    // Post actions
    createPost: postActions.createPost,
    deletePost: postActions.deletePost,
    addComment: postActions.addComment,
    addReaction: postActions.addReaction,
    bookmarkPost: postActions.bookmarkPost,
    isBookmarked: postActions.isBookmarked,
    
    // Friend actions
    sendFriendRequest: friendActions.sendFriendRequest,
    respondToFriendRequest: friendActions.respondToFriendRequest,
    
    // Refetch methods
    refetchProfile,
    refetchPosts,
    refetchFriends,
    refetchBookmarks
  };
}

// Re-export all individual hooks
export {
  useProfileData,
  useProfileActions,
  usePostActions,
  useFriendActions,
  useAdminSocialAccess,
  useEnsureAdminProfile,
  useProfilePosts,
  useProfileFriends,
  useProfileBookmarks
};
