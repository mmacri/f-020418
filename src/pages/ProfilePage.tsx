import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSocialProfile } from "@/hooks/useSocialProfile";
import { ProfileHeader } from "@/components/social/ProfileHeader";
import { CreatePostForm } from "@/components/social/CreatePostForm";
import { PostCard } from "@/components/social/PostCard";
import { ProfileSettings } from "@/components/social/ProfileSettings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FriendRequestCard } from "@/components/social/FriendRequestCard";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Users, Settings, UserCircle, AlertTriangle } from "lucide-react";
import { UserProfile } from "@/types/social";

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="mb-8">
            <div className="h-32 sm:h-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="px-4 sm:px-8 relative -mt-12 sm:-mt-16">
              <div className="flex flex-col sm:flex-row">
                <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-full" />
                <div className="mt-4 sm:mt-0 sm:ml-4 flex-1">
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-full max-w-xl mb-2" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-60 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Profile Not Found</AlertTitle>
            <AlertDescription>
              Sorry, this profile doesn't exist or you don't have permission to view it.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }
  
  const handleProfileUpdate = async (data: Partial<UserProfile>) => {
    const updated = await updateProfile(data);
    if (updated) {
      setIsEditing(false);
    }
    return updated !== null;
  };
  
  if (isEditing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <ProfileSettings 
            profile={profile}
            onSave={handleProfileUpdate}
            onDeleteAccount={deleteAccount}
            onCancel={() => setIsEditing(false)}
          />
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!profile.is_public && !isCurrentUser && friendshipStatus !== 'accepted') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="mb-8">
            <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
            <div className="px-4 sm:px-8 relative -mt-12 sm:-mt-16">
              <div className="flex flex-col sm:flex-row items-center sm:items-end">
                <div className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white bg-white rounded-full flex items-center justify-center">
                  <UserCircle className="h-16 w-16 sm:h-24 sm:w-24 text-gray-300" />
                </div>
                
                <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left flex-1 mb-4">
                  <h1 className="text-2xl font-bold">{profile.display_name}</h1>
                  <div className="mt-2">
                    <div className="inline-block bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1 text-sm">
                      Private Profile
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mb-4 text-amber-500">
                <AlertTriangle className="h-12 w-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold mb-2">This profile is private</h2>
              <p className="text-muted-foreground mb-4">
                {profile.display_name} has set their profile to private. 
                {friendshipStatus === 'pending' 
                  ? " Your friend request is pending." 
                  : " Send a friend request to connect."}
              </p>
              
              {friendshipStatus === 'none' && (
                <button 
                  onClick={() => sendFriendRequest(profile.id)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Send Friend Request
                </button>
              )}
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
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
          
          <TabsContent value="posts" className="space-y-4">
            {isCurrentUser && (
              <CreatePostForm profile={profile} onCreatePost={createPost} />
            )}
            
            {posts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                  <p className="text-muted-foreground">
                    {isCurrentUser 
                      ? "Create your first post to share with friends." 
                      : `${profile.display_name} hasn't posted anything yet.`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    isOwner={isCurrentUser}
                    onAddComment={addComment}
                    onAddReaction={addReaction}
                    onDeletePost={deletePost}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="friends" className="space-y-4">
            {isCurrentUser && pendingFriendRequests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Friend Requests ({pendingFriendRequests.length})</h3>
                <div className="space-y-3">
                  {pendingFriendRequests.map((request) => (
                    <FriendRequestCard 
                      key={request.id} 
                      request={request} 
                      onRespond={respondToFriendRequest} 
                    />
                  ))}
                </div>
              </div>
            )}
            
            <h3 className="text-lg font-medium mb-3">Friends ({friends.length})</h3>
            
            {friends.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No friends yet</h3>
                  <p className="text-muted-foreground">
                    {isCurrentUser 
                      ? "Connect with others by sending friend requests." 
                      : `${profile.display_name} hasn't added any friends yet.`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {friends.map((friendship) => {
                  const friendProfile = friendship.requestor?.id === profile.id
                    ? friendship.recipient
                    : friendship.requestor;
                    
                  if (!friendProfile) return null;
                  
                  return (
                    <Card key={friendship.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4" onClick={() => navigate(`/profile/${friendProfile.id}`)} style={{ cursor: 'pointer' }}>
                          <div className="relative">
                            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                              {friendProfile.avatar_url ? (
                                <img 
                                  src={friendProfile.avatar_url} 
                                  alt={friendProfile.display_name} 
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://ext.same-assets.com/2651616194/3622592620.jpeg";
                                  }} 
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground">
                                  {friendProfile.display_name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium">{friendProfile.display_name}</h4>
                            <p className="text-sm text-muted-foreground">Friends</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="about">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Bio</h3>
                    <p className="text-muted-foreground">
                      {profile.bio || `${isCurrentUser ? "You haven't" : `${profile.display_name} hasn't`} added a bio yet.`}
                    </p>
                  </div>
                  
                  {isCurrentUser && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Profile Settings</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Profile Visibility:</span>
                          <span className={profile.is_public ? "text-green-600" : "text-amber-600"}>
                            {profile.is_public ? "Public" : "Private"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Newsletter:</span>
                          <span className={profile.newsletter_subscribed ? "text-green-600" : "text-gray-600"}>
                            {profile.newsletter_subscribed ? "Subscribed" : "Not Subscribed"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
