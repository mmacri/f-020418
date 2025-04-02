
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { ProfilePostsTab } from "@/components/social/ProfilePostsTab";
import { ProfileFriendsTab } from "@/components/social/ProfileFriendsTab";
import { ProfileAboutTab } from "@/components/social/ProfileAboutTab";
import { ProfileBookmarksTab } from "@/components/social/ProfileBookmarksTab";
import { UserProfile, Post, Friendship, Bookmark, ReactionType } from "@/types/social";

interface ProfileTabContentProps {
  activeTab: string;
  profile: UserProfile;
  posts: Post[];
  friends: Friendship[];
  bookmarks: Bookmark[];
  pendingFriendRequests: Friendship[];
  isCurrentUser: boolean;
  isAdmin: boolean;
  isUploading: boolean;
  onCreatePost: (content: string, imageFile?: File) => Promise<any>;
  onAddComment: (postId: string, content: string) => Promise<any>;
  onAddReaction: (type: ReactionType, postId: string) => Promise<any>;
  onDeletePost: (postId: string) => Promise<boolean>;
  onBookmarkPost: (postId: string) => Promise<boolean>;
  onIsBookmarked: (postId: string) => Promise<boolean>;
  onRespondToFriendRequest: (requestId: string, accept: boolean) => Promise<any>;
}

export const ProfileTabContent: React.FC<ProfileTabContentProps> = ({
  activeTab,
  profile,
  posts,
  friends,
  bookmarks,
  pendingFriendRequests,
  isCurrentUser,
  isAdmin,
  isUploading,
  onCreatePost,
  onAddComment,
  onAddReaction,
  onDeletePost,
  onBookmarkPost,
  onIsBookmarked,
  onRespondToFriendRequest
}) => {
  return (
    <>
      <TabsContent value="posts">
        <ProfilePostsTab 
          profile={profile}
          posts={posts}
          isCurrentUser={isCurrentUser || isAdmin}
          createPost={onCreatePost}
          addComment={onAddComment}
          addReaction={onAddReaction}
          deletePost={onDeletePost}
          bookmarkPost={onBookmarkPost}
          isBookmarked={onIsBookmarked}
          isUploading={isUploading}
        />
      </TabsContent>
      
      <TabsContent value="friends">
        <ProfileFriendsTab 
          profile={profile}
          friends={friends}
          pendingFriendRequests={pendingFriendRequests}
          isCurrentUser={isCurrentUser || isAdmin}
          respondToFriendRequest={onRespondToFriendRequest}
        />
      </TabsContent>
      
      {(isCurrentUser || isAdmin) && (
        <TabsContent value="bookmarks">
          <ProfileBookmarksTab 
            profile={profile}
            bookmarks={bookmarks}
            addComment={onAddComment}
            addReaction={onAddReaction}
            bookmarkPost={onBookmarkPost}
          />
        </TabsContent>
      )}
      
      <TabsContent value="about">
        <ProfileAboutTab profile={profile} isCurrentUser={isCurrentUser || isAdmin} />
      </TabsContent>
    </>
  );
};
