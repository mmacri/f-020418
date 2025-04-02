
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile, Post, Friendship, Bookmark } from "@/types/social";
import { ProfileHeader } from "@/components/social/ProfileHeader";
import { ProfilePostsTab } from "@/components/social/ProfilePostsTab";
import { ProfileFriendsTab } from "@/components/social/ProfileFriendsTab";
import { ProfileAboutTab } from "@/components/social/ProfileAboutTab";
import { ProfileBookmarksTab } from "@/components/social/ProfileBookmarksTab";
import { MessageSquare, Users, UserCircle, Bookmark as BookmarkIcon } from "lucide-react";

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
        <TabsList className="grid w-full md:w-auto grid-cols-4 max-w-[500px]">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex items-center gap-2">
            <Users size={16} />
            <span className="hidden sm:inline">Friends</span>
          </TabsTrigger>
          {(isCurrentUser || isAdmin) && (
            <TabsTrigger value="bookmarks" className="flex items-center gap-2">
              <BookmarkIcon size={16} />
              <span className="hidden sm:inline">Bookmarks</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="about" className="flex items-center gap-2">
            <UserCircle size={16} />
            <span className="hidden sm:inline">About</span>
          </TabsTrigger>
        </TabsList>
        
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
      </Tabs>
    </div>
  );
};
