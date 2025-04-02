
import React, { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { UserProfile, Post, Friendship, Bookmark } from "@/types/social";
import { ProfileHeader } from "@/components/social/ProfileHeader";
import { ProfileTabList } from "@/components/social/tabs/ProfileTabList";
import { ProfileTabContent } from "@/components/social/tabs/ProfileTabContent";

interface ProfileTabsViewProps {
  profile: UserProfile;
  posts: Post[];
  friends: Friendship[];
  bookmarks: Bookmark[];
  pendingFriendRequests: Friendship[];
  isCurrentUser: boolean;
  isAdmin: boolean;
  friendshipStatus: 'none' | 'pending' | 'accepted' | 'requested';
  isUploading: boolean;
  
  // Actions
  onCreatePost: (content: string, imageFile?: File) => Promise<any>;
  onAddComment: (postId: string, content: string) => Promise<any>;
  onAddReaction: (type: 'like' | 'heart' | 'thumbs_up' | 'thumbs_down', postId: string) => Promise<any>;
  onDeletePost: (postId: string) => Promise<boolean>;
  onBookmarkPost: (postId: string) => Promise<boolean>;
  onIsBookmarked: (postId: string) => Promise<boolean>;
  onSendFriendRequest: (recipientId: string) => Promise<any>;
  onRespondToFriendRequest: (requestId: string, accept: boolean) => Promise<any>;
  onUpdateProfile: () => void;
}

export const ProfileTabsView: React.FC<ProfileTabsViewProps> = ({
  profile,
  posts,
  friends,
  bookmarks,
  pendingFriendRequests,
  isCurrentUser,
  isAdmin,
  friendshipStatus,
  isUploading,
  onCreatePost,
  onAddComment,
  onAddReaction,
  onDeletePost,
  onBookmarkPost,
  onIsBookmarked,
  onSendFriendRequest,
  onRespondToFriendRequest,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState("posts");
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader 
        profile={profile} 
        postCount={posts.length} 
        friendCount={friends.length}
        isCurrentUser={isCurrentUser}
        friendshipStatus={friendshipStatus}
        pendingRequests={pendingFriendRequests}
        onSendFriendRequest={onSendFriendRequest}
        onUpdateProfile={onUpdateProfile}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <ProfileTabList isCurrentUser={isCurrentUser} isAdmin={isAdmin} />
        <ProfileTabContent 
          activeTab={activeTab}
          profile={profile}
          posts={posts}
          friends={friends}
          bookmarks={bookmarks}
          pendingFriendRequests={pendingFriendRequests}
          isCurrentUser={isCurrentUser}
          isAdmin={isAdmin}
          isUploading={isUploading}
          onCreatePost={onCreatePost}
          onAddComment={onAddComment}
          onAddReaction={onAddReaction}
          onDeletePost={onDeletePost}
          onBookmarkPost={onBookmarkPost}
          onIsBookmarked={onIsBookmarked}
          onRespondToFriendRequest={onRespondToFriendRequest}
        />
      </Tabs>
    </div>
  );
};
