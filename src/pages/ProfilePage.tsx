
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSocialProfile } from "@/hooks/useSocialProfile";
import { ProfileLoadingSkeleton } from "@/components/social/ProfileLoadingSkeleton";
import { ProfileNotFound } from "@/components/social/ProfileNotFound";
import { PrivateProfileView } from "@/components/social/PrivateProfileView";
import { useEnsureAdminProfile } from "@/hooks/social/useEnsureAdminProfile";
import { useAuthentication } from "@/hooks/useAuthentication";
import { UserProfile } from "@/types/social";
import { SuperAdminDashboard } from "@/components/social/SuperAdminDashboard";
import { ProfileErrorAlert } from "@/components/social/ProfileErrorAlert";
import { ProfileEditForm } from "@/components/social/ProfileEditForm";
import { ProfileTabsView } from "@/components/social/ProfileTabsView";

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
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
        <SuperAdminDashboard />
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        {hasError && (
          <ProfileErrorAlert 
            error={profileError || profileCreationError} 
            onRetry={handleRetryProfileCreation} 
          />
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
          <ProfileEditForm
            profile={profile}
            avatarFile={avatarFile}
            isUploading={isUploading}
            onAvatarChange={handleAvatarChange}
            onUpdateProfile={handleProfileUpdate}
            onDeleteAccount={deleteAccount}
            onCancel={() => setIsEditing(false)}
          />
        ) : !profile.is_public && !isCurrentUser && friendshipStatus !== 'accepted' && !isAdmin ? (
          <PrivateProfileView 
            profile={profile} 
            friendshipStatus={friendshipStatus} 
            onSendFriendRequest={sendFriendRequest} 
          />
        ) : (
          <ProfileTabsView
            profile={profile}
            posts={posts}
            friends={friends}
            bookmarks={bookmarks}
            pendingFriendRequests={pendingFriendRequests}
            isCurrentUser={isCurrentUser}
            isAdmin={isAdmin}
            friendshipStatus={friendshipStatus}
            isUploading={isUploading}
            onCreatePost={handleCreatePost}
            onAddComment={addComment}
            onAddReaction={addReaction}
            onDeletePost={deletePost}
            onBookmarkPost={bookmarkPost}
            onIsBookmarked={isBookmarked}
            onSendFriendRequest={sendFriendRequest}
            onRespondToFriendRequest={respondToFriendRequest}
            onUpdateProfile={() => setIsEditing(true)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
