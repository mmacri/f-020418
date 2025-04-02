
import { useProfileData as useProfileDataOriginal } from './useProfileData';
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
  const profileData = useProfileDataOriginal(userId);
  const profileActions = useProfileActions();
  const postActions = usePostActions();
  const friendActions = useFriendActions();
  
  return {
    ...profileData,
    ...profileActions,
    ...postActions,
    ...friendActions
  };
}

// Re-export all individual hooks
export {
  useProfileDataOriginal as useProfileData,
  useProfileActions,
  usePostActions,
  useFriendActions,
  useAdminSocialAccess,
  useEnsureAdminProfile,
  useProfilePosts,
  useProfileFriends,
  useProfileBookmarks
};
