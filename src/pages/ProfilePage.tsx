
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSocialProfile } from "@/hooks/useSocialProfile";
import { ProfileHeader } from "@/components/social/ProfileHeader";
import { ProfileSettings } from "@/components/social/ProfileSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, UserCircle } from "lucide-react";
import { UserProfile } from "@/types/social";
import { ProfileLoadingSkeleton } from "@/components/social/ProfileLoadingSkeleton";
import { ProfileNotFound } from "@/components/social/ProfileNotFound";
import { PrivateProfileView } from "@/components/social/PrivateProfileView";
import { ProfilePostsTab } from "@/components/social/ProfilePostsTab";
import { ProfileFriendsTab } from "@/components/social/ProfileFriendsTab";
import { ProfileAboutTab } from "@/components/social/ProfileAboutTab";

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    profile,
    posts,
    pendingFriendRequests,
    friends,
    isLoading,
    isCurrentUser,
    friendshipStatus,
    createPost,
    deletePost,
    addComment,
    addReaction,
    updateProfile,
    sendFriendRequest,
    respondToFriendRequest,
    deleteAccount
  } = useSocialProfile(id);
  
  const handleProfileUpdate = async (data: Partial<UserProfile>) => {
    const updated = await updateProfile(data);
    if (updated) {
      setIsEditing(false);
    }
    return updated !== null;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        {isLoading ? (
          <ProfileLoadingSkeleton />
        ) : !profile ? (
          <ProfileNotFound />
        ) : isEditing ? (
          <div className="container mx-auto px-4 py-8">
            <ProfileSettings 
              profile={profile}
              onSave={updateProfile}
              onDeleteAccount={deleteAccount}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : !profile.is_public && !isCurrentUser && friendshipStatus !== 'accepted' ? (
          <PrivateProfileView 
            profile={profile} 
            friendshipStatus={friendshipStatus} 
            onSendFriendRequest={sendFriendRequest} 
          />
        ) : (
          <div className="container mx-auto px-4 py-8">
            <ProfileHeader 
              profile={profile} 
              postCount={posts.length} 
              friendCount={friends.length}
              isCurrentUser={isCurrentUser}
              friendshipStatus={friendshipStatus}
              pendingRequests={pendingFriendRequests}
              onSendFriendRequest={sendFriendRequest}
              onUpdateProfile={() => setIsEditing(true)}
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full md:w-auto grid-cols-3 max-w-[400px]">
                <TabsTrigger value="posts" className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  <span className="hidden sm:inline">Posts</span>
                </TabsTrigger>
                <TabsTrigger value="friends" className="flex items-center gap-2">
                  <Users size={16} />
                  <span className="hidden sm:inline">Friends</span>
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2">
                  <UserCircle size={16} />
                  <span className="hidden sm:inline">About</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts">
                <ProfilePostsTab 
                  profile={profile}
                  posts={posts}
                  isCurrentUser={isCurrentUser}
                  createPost={createPost}
                  addComment={addComment}
                  addReaction={addReaction}
                  deletePost={deletePost}
                />
              </TabsContent>
              
              <TabsContent value="friends">
                <ProfileFriendsTab 
                  profile={profile}
                  friends={friends}
                  pendingFriendRequests={pendingFriendRequests}
                  isCurrentUser={isCurrentUser}
                  respondToFriendRequest={respondToFriendRequest}
                />
              </TabsContent>
              
              <TabsContent value="about">
                <ProfileAboutTab profile={profile} isCurrentUser={isCurrentUser} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
