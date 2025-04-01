import { useState } from 'react';
import { useProfileData } from './useProfileData';
import { usePostActions } from './usePostActions';
import { useProfileActions } from './useProfileActions';
import { useFriendActions } from './useFriendActions';
import { SocialProfileHook } from './types';

export const useSocialProfile = (profileId?: string): SocialProfileHook => {
  const {
    profile,
    posts,
    pendingFriendRequests,
    friends,
    isLoading,
    isCurrentUser,
    friendshipStatus
  } = useProfileData(profileId);

  const [postsState, setPostsState] = useState(posts);
  
  // Keep posts in sync with the profile data
  if (posts !== postsState) {
    setPostsState(posts);
  }

  const {
    createPost,
    deletePost,
    addComment,
    addReaction
  } = usePostActions(postsState, setPostsState);

  const [profileState, setProfileState] = useState(profile);
  
  // Keep profile in sync with the profile data
  if (profile !== profileState) {
    setProfileState(profile);
  }

  const {
    updateProfile,
    deleteAccount
  } = useProfileActions(profileState, setProfileState);

  const [friendshipStatusState, setFriendshipStatusState] = useState(friendshipStatus);
  const [pendingRequestsState, setPendingRequestsState] = useState(pendingFriendRequests);
  const [friendsState, setFriendsState] = useState(friends);
  
  // Keep friendship data in sync with the profile data
  if (friendshipStatus !== friendshipStatusState) {
    setFriendshipStatusState(friendshipStatus);
  }
  
  if (pendingFriendRequests !== pendingRequestsState) {
    setPendingRequestsState(pendingFriendRequests);
  }
  
  if (friends !== friendsState) {
    setFriendsState(friends);
  }

  const {
    sendFriendRequest,
    respondToFriendRequest
  } = useFriendActions(
    friendshipStatusState, 
    setFriendshipStatusState,
    setPendingRequestsState,
    setFriendsState
  );

  return {
    profile: profileState,
    posts: postsState,
    pendingFriendRequests: pendingRequestsState,
    friends: friendsState,
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
    deleteAccount
  };
};

export * from './types';
