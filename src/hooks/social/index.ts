import { useState, useEffect } from 'react';
import { useProfileData } from './useProfileData';
import { usePostActions } from './usePostActions';
import { useProfileActions } from './useProfileActions';
import { useFriendActions } from './useFriendActions';
import { SocialProfileHook } from './types';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { createWelcomePost, checkAndCreateAdminProfile } from './utils';

export const useSocialProfile = (profileId?: string): SocialProfileHook => {
  const {
    profile,
    posts,
    pendingFriendRequests,
    friends,
    bookmarks,
    isLoading,
    isCurrentUser,
    friendshipStatus
  } = useProfileData(profileId);

  const [postsState, setPostsState] = useState(posts);
  
  // Keep posts in sync with the profile data
  useEffect(() => {
    if (posts !== postsState) {
      setPostsState(posts);
    }
  }, [posts]);

  const {
    createPost,
    deletePost,
    addComment,
    addReaction,
    bookmarkPost,
    isBookmarked,
    isUploading: isPostUploading
  } = usePostActions(postsState, setPostsState);

  const [profileState, setProfileState] = useState(profile);
  
  // Keep profile in sync with the profile data
  useEffect(() => {
    if (profile !== profileState) {
      setProfileState(profile);
    }
  }, [profile]);

  const {
    updateProfile,
    deleteAccount,
    isUploading: isProfileUploading
  } = useProfileActions(profileState, setProfileState);

  const [friendshipStatusState, setFriendshipStatusState] = useState(friendshipStatus);
  const [pendingRequestsState, setPendingRequestsState] = useState(pendingFriendRequests);
  const [friendsState, setFriendsState] = useState(friends);
  const [bookmarksState, setBookmarksState] = useState(bookmarks);
  
  // Keep friendship and bookmark data in sync with the profile data
  useEffect(() => {
    if (friendshipStatus !== friendshipStatusState) {
      setFriendshipStatusState(friendshipStatus);
    }
    
    if (pendingFriendRequests !== pendingRequestsState) {
      setPendingRequestsState(pendingFriendRequests);
    }
    
    if (friends !== friendsState) {
      setFriendsState(friends);
    }

    if (bookmarks !== bookmarksState) {
      setBookmarksState(bookmarks);
    }
  }, [friendshipStatus, pendingFriendRequests, friends, bookmarks]);

  const {
    sendFriendRequest,
    respondToFriendRequest
  } = useFriendActions(
    friendshipStatusState, 
    setFriendshipStatusState,
    setPendingRequestsState,
    setFriendsState
  );

  // Run once on initial load to check for admin welcome post
  useEffect(() => {
    const setupInitialData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Check if admin exists, if not create it
          await checkAndCreateAdminProfile();
          
          // Check if there are any posts, if not create welcome post
          const { count, error } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true });
            
          if (error) {
            console.error('Error checking posts:', error);
            return;
          }
          
          if (count === 0) {
            await createWelcomePost();
          }
        }
      } catch (error) {
        console.error('Error in initial setup:', error);
      }
    };
    
    setupInitialData();
  }, []);

  return {
    profile: profileState,
    posts: postsState,
    pendingFriendRequests: pendingRequestsState,
    friends: friendsState,
    bookmarks: bookmarksState,
    isLoading,
    isCurrentUser,
    friendshipStatus: friendshipStatusState,
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
    isUploading: isProfileUploading || isPostUploading
  };
};

export * from './types';
