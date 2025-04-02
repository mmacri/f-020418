
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSocialProfile } from "@/hooks/useSocialProfile";
import { ProfileHeader } from "@/components/social/ProfileHeader";
import { ProfileSettings } from "@/components/social/ProfileSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, MessageSquare, Users, UserCircle, Bookmark, Settings, Shield } from "lucide-react";
import { UserProfile } from "@/types/social";
import { ProfileLoadingSkeleton } from "@/components/social/ProfileLoadingSkeleton";
import { ProfileNotFound } from "@/components/social/ProfileNotFound";
import { PrivateProfileView } from "@/components/social/PrivateProfileView";
import { ProfilePostsTab } from "@/components/social/ProfilePostsTab";
import { ProfileFriendsTab } from "@/components/social/ProfileFriendsTab";
import { ProfileAboutTab } from "@/components/social/ProfileAboutTab";
import { ProfileBookmarksTab } from "@/components/social/ProfileBookmarksTab";
import { FileUpload } from "@/components/FileUpload";
import { useEnsureAdminProfile } from "@/hooks/social/useEnsureAdminProfile";
import { useAuthentication } from "@/hooks/useAuthentication";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { isAdmin, user } = useAuthentication();
  
  // Check if the current user is the super admin
  const isSuperAdmin = isAdmin && user?.email === 'admin@recoveryessentials.com';
  
  // Ensure admin has a social profile (skips for super admin)
  const { isCreating, isComplete, error: profileCreationError } = useEnsureAdminProfile();
  
  const {
    profile,
    posts,
    pendingFriendRequests,
    friends,
    bookmarks,
    isLoading,
    isCurrentUser,
    friendshipStatus,
    isUploading,
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
    error: profileError
  } = useSocialProfile(id);
  
  // Reset avatar file when profile changes
  useEffect(() => {
    setAvatarFile(null);
  }, [profile]);
  
  // Debug logs
  useEffect(() => {
    if (isAdmin) {
      console.log('Admin user detected:', user?.id);
      console.log('Is super admin:', isSuperAdmin);
      console.log('Profile creation status:', { isCreating, isComplete, error: profileCreationError });
    }
    
    if (profile) {
      console.log('Profile loaded:', profile.id, profile.display_name);
    } else if (!isLoading) {
      console.log('No profile loaded and not loading');
    }
  }, [isAdmin, user, isCreating, isComplete, profileCreationError, profile, isLoading, isSuperAdmin]);
  
  const handleCreatePost = async (content: string, imageFile?: File) => {
    return createPost(content, imageFile);
  };
  
  const handleProfileUpdate = async (data: Partial<UserProfile>) => {
    const updated = await updateProfile(data, avatarFile || undefined);
    if (updated) {
      setIsEditing(false);
      setAvatarFile(null);
    }
    return updated !== null;
  };
  
  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
  };
  
  // Combined loading state for both initial load and admin profile creation
  const combinedLoading = isLoading || isCreating;
  
  // Error display for profile or creation errors
  const hasError = (profileError || profileCreationError) && !combinedLoading;
  
  // Retry logic for admin profile creation
  const handleRetryProfileCreation = async () => {
    window.location.reload();
  };

  // If this is the super admin (admin@recoveryessentials.com) viewing their own profile
  if (isSuperAdmin && !id) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-8">
          <Card className="mb-8">
            <CardHeader className="bg-primary/10">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Super Admin Dashboard</CardTitle>
                  <CardDescription>
                    This account is designated as the super administrator without a social profile
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Super Administrator Account</AlertTitle>
                <AlertDescription>
                  This is the main administrative account for Recovery Essentials. As the super admin, 
                  you can manage all social profiles and content but don't have your own social profile.
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
                <Link to="/admin" className="no-underline">
                  <Card className="hover:bg-accent/10 transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <Settings className="h-5 w-5 mb-2 text-primary" />
                      <CardTitle className="text-lg">Admin Dashboard</CardTitle>
                      <CardDescription>Manage site settings and content</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
                
                <Link to="/admin/auth" className="no-underline">
                  <Card className="hover:bg-accent/10 transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <Users className="h-5 w-5 mb-2 text-primary" />
                      <CardTitle className="text-lg">User Management</CardTitle>
                      <CardDescription>Manage user accounts and permissions</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
                
                <Link to="/" className="no-underline">
                  <Card className="hover:bg-accent/10 transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <MessageSquare className="h-5 w-5 mb-2 text-primary" />
                      <CardTitle className="text-lg">Social Feed</CardTitle>
                      <CardDescription>View and moderate social content</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
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
      <div className="flex-grow">
        {hasError && (
          <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error loading profile</AlertTitle>
              <AlertDescription>
                {profileError || profileCreationError || "Failed to load or create the profile."}
              </AlertDescription>
              <Button variant="outline" className="mt-4" onClick={handleRetryProfileCreation}>
                Retry
              </Button>
            </Alert>
          </div>
        )}
        
        {combinedLoading ? (
          <ProfileLoadingSkeleton />
        ) : !profile ? (
          <ProfileNotFound 
            userId={id} 
            isCurrentUser={isCurrentUser} 
            onCreateProfile={(displayName) => updateProfile({ display_name: displayName, is_public: true })}
          />
        ) : isEditing ? (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
              {profile.avatar_url && (
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.display_name} 
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div className="max-w-md mx-auto mb-6">
                <FileUpload
                  onFileChange={handleAvatarChange}
                  accept="image/*"
                  maxSizeMB={2}
                  className="mb-4"
                />
              </div>
            </div>
            
            <ProfileSettings 
              profile={profile}
              onSave={handleProfileUpdate}
              onDeleteAccount={deleteAccount}
              onCancel={() => setIsEditing(false)}
              isUploading={isUploading}
            />
          </div>
        ) : !profile.is_public && !isCurrentUser && friendshipStatus !== 'accepted' && !isAdmin ? (
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
                    <Bookmark size={16} />
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
                  createPost={handleCreatePost}
                  addComment={addComment}
                  addReaction={addReaction}
                  deletePost={deletePost}
                  bookmarkPost={bookmarkPost}
                  isBookmarked={isBookmarked}
                  isUploading={isUploading}
                />
              </TabsContent>
              
              <TabsContent value="friends">
                <ProfileFriendsTab 
                  profile={profile}
                  friends={friends}
                  pendingFriendRequests={pendingFriendRequests}
                  isCurrentUser={isCurrentUser || isAdmin}
                  respondToFriendRequest={respondToFriendRequest}
                />
              </TabsContent>
              
              {(isCurrentUser || isAdmin) && (
                <TabsContent value="bookmarks">
                  <ProfileBookmarksTab 
                    profile={profile}
                    bookmarks={bookmarks}
                    addComment={addComment}
                    addReaction={addReaction}
                    bookmarkPost={bookmarkPost}
                  />
                </TabsContent>
              )}
              
              <TabsContent value="about">
                <ProfileAboutTab profile={profile} isCurrentUser={isCurrentUser || isAdmin} />
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
