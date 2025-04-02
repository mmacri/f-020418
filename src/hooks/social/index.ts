
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { useProfileData } from './useProfileData';
import { useProfilePosts } from './useProfilePosts';
import { useProfileFriends } from './useProfileFriends';
import { useProfileBookmarks } from './useProfileBookmarks';
import { useAdminSocialAccess } from './useAdminSocialAccess';
import { useAuthentication } from '@/hooks/useAuthentication';
import { Comment, Post, UserProfile } from '@/types/social';

export const useSocialProfile = (userId?: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const { isAdmin } = useAuthentication();
  const { hasAccess: adminHasAccess } = useAdminSocialAccess();
  
  // Treat the profile as belonging to current user if admin is viewing
  const effectiveIsCurrentUser = (isCurrentUser: boolean) => isCurrentUser || (isAdmin && adminHasAccess);

  // Get profile data
  const { 
    profile, 
    isLoading: profileLoading, 
    isCurrentUser, 
    friendshipStatus,
    refetchProfile
  } = useProfileData(userId);

  // Get profile posts
  const { 
    posts, 
    isLoading: postsLoading,
    refetchPosts
  } = useProfilePosts(userId);

  // Get friends data - admin can see all friends
  const { 
    friends, 
    pendingFriendRequests, 
    isLoading: friendsLoading,
    refetchFriends
  } = useProfileFriends(userId, effectiveIsCurrentUser(isCurrentUser));

  // Get bookmarks - admin can see all bookmarks
  const { 
    bookmarks, 
    isLoading: bookmarksLoading,
    refetchBookmarks
  } = useProfileBookmarks(userId, effectiveIsCurrentUser(isCurrentUser));

  // Create a new post
  const createPost = async (content: string, imageFile?: File): Promise<Post | null> => {
    if (!profile) return null;
    
    try {
      setIsUploading(true);
      
      let imageUrl = null;
      
      // Upload image if provided
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('social-images')
          .upload(`posts/${profile.id}/${fileName}`, imageFile);
        
        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error('Failed to upload image');
          return null;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('social-images')
          .getPublicUrl(`posts/${profile.id}/${fileName}`);
        
        imageUrl = publicUrl;
      }
      
      // Create post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: profile.id,
          content,
          image_url: imageUrl
        })
        .select('*')
        .single();
      
      if (postError) {
        console.error('Error creating post:', postError);
        toast.error('Failed to create post');
        return null;
      }
      
      toast.success('Post created successfully');
      refetchPosts();
      
      return {
        ...postData,
        user: profile,
        comments: [],
        reactions: [],
        reaction_counts: {
          like: 0,
          heart: 0,
          thumbs_up: 0,
          thumbs_down: 0
        }
      } as Post;
      
    } catch (error) {
      console.error('Error in createPost:', error);
      toast.error('An error occurred while creating the post');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Delete a post
  const deletePost = async (postId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
        return false;
      }
      
      toast.success('Post deleted successfully');
      refetchPosts();
      return true;
    } catch (error) {
      console.error('Error in deletePost:', error);
      toast.error('An error occurred while deleting the post');
      return false;
    }
  };

  // Add a comment to a post
  const addComment = async (postId: string, content: string): Promise<Comment | null> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error('You must be logged in to comment');
        return null;
      }
      
      const userId = sessionData.session.user.id;
      
      const { data: commentData, error: commentError } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: userId,
          content
        })
        .select(`
          *,
          user:user_profiles(*)
        `)
        .single();
      
      if (commentError) {
        console.error('Error adding comment:', commentError);
        toast.error('Failed to add comment');
        return null;
      }
      
      // Process user data
      let commentUser: UserProfile;
      
      if (commentData.user && 
          typeof commentData.user === 'object' && 
          commentData.user !== null && 
          !('error' in (commentData.user as object))) {
        commentUser = commentData.user as UserProfile;
      } else {
        // Fallback if relation fails
        const { data: userData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        commentUser = userData as UserProfile || {
          id: userId,
          display_name: "Unknown User",
          bio: null,
          avatar_url: null,
          is_public: false,
          newsletter_subscribed: false,
          created_at: commentData.created_at,
          updated_at: commentData.created_at
        };
      }
      
      refetchPosts();
      
      return {
        ...commentData,
        user: commentUser,
        reactions: [],
        reaction_counts: {
          like: 0,
          heart: 0,
          thumbs_up: 0,
          thumbs_down: 0
        }
      } as Comment;
      
    } catch (error) {
      console.error('Error in addComment:', error);
      toast.error('An error occurred while adding the comment');
      return null;
    }
  };

  // Add reaction to a post or comment
  const addReaction = async (
    type: 'like' | 'heart' | 'thumbs_up' | 'thumbs_down', 
    postId: string, 
    commentId?: string
  ): Promise<boolean> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error('You must be logged in to react');
        return false;
      }
      
      const userId = sessionData.session.user.id;
      
      // Check if user already reacted
      const { data: existingReaction, error: checkError } = await supabase
        .from('reactions')
        .select('*')
        .eq('user_id', userId)
        .eq(commentId ? 'comment_id' : 'post_id', commentId || postId);
      
      if (checkError) {
        console.error('Error checking existing reaction:', checkError);
        return false;
      }
      
      // If user already reacted, remove the reaction
      if (existingReaction && existingReaction.length > 0) {
        const { error: deleteError } = await supabase
          .from('reactions')
          .delete()
          .eq('id', existingReaction[0].id);
        
        if (deleteError) {
          console.error('Error removing reaction:', deleteError);
          return false;
        }
      }
      
      // If reaction was different or didn't exist, add new reaction
      if (!existingReaction || existingReaction.length === 0 || existingReaction[0].type !== type) {
        const { error: insertError } = await supabase
          .from('reactions')
          .insert({
            user_id: userId,
            post_id: commentId ? null : postId,
            comment_id: commentId || null,
            type
          });
        
        if (insertError) {
          console.error('Error adding reaction:', insertError);
          return false;
        }
      }
      
      refetchPosts();
      return true;
    } catch (error) {
      console.error('Error in addReaction:', error);
      return false;
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<UserProfile>, avatarFile?: File): Promise<UserProfile | null> => {
    if (!profile) return null;
    
    try {
      setIsUploading(true);
      let imageUrl = profile.avatar_url;
      
      // Upload avatar if provided
      if (avatarFile) {
        const fileName = `${Date.now()}-${avatarFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('social-images')
          .upload(`avatars/${profile.id}/${fileName}`, avatarFile);
        
        if (uploadError) {
          console.error('Error uploading avatar:', uploadError);
          toast.error('Failed to upload avatar');
          return null;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('social-images')
          .getPublicUrl(`avatars/${profile.id}/${fileName}`);
        
        imageUrl = publicUrl;
      }
      
      const updateData = {
        ...data,
        avatar_url: avatarFile ? imageUrl : data.avatar_url
      };
      
      const { data: updatedProfile, error: updateError } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', profile.id)
        .select('*')
        .single();
      
      if (updateError) {
        console.error('Error updating profile:', updateError);
        toast.error('Failed to update profile');
        return null;
      }
      
      toast.success('Profile updated successfully');
      refetchProfile();
      
      return updatedProfile as UserProfile;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      toast.error('An error occurred while updating the profile');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Send friend request
  const sendFriendRequest = async (): Promise<boolean> => {
    if (!profile) return false;
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error('You must be logged in to send friend requests');
        return false;
      }
      
      const currentUserId = sessionData.session.user.id;
      
      const { error } = await supabase
        .from('friendships')
        .insert({
          requestor_id: currentUserId,
          recipient_id: profile.id,
          status: 'pending'
        });
      
      if (error) {
        console.error('Error sending friend request:', error);
        toast.error('Failed to send friend request');
        return false;
      }
      
      toast.success('Friend request sent');
      refetchFriends();
      return true;
    } catch (error) {
      console.error('Error in sendFriendRequest:', error);
      toast.error('An error occurred while sending the friend request');
      return false;
    }
  };

  // Respond to friend request
  const respondToFriendRequest = async (friendshipId: string, accept: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({
          status: accept ? 'accepted' : 'rejected'
        })
        .eq('id', friendshipId);
      
      if (error) {
        console.error('Error responding to friend request:', error);
        toast.error(`Failed to ${accept ? 'accept' : 'reject'} friend request`);
        return false;
      }
      
      toast.success(`Friend request ${accept ? 'accepted' : 'rejected'}`);
      refetchFriends();
      return true;
    } catch (error) {
      console.error('Error in respondToFriendRequest:', error);
      toast.error('An error occurred while responding to the friend request');
      return false;
    }
  };

  // Bookmark or unbookmark a post
  const bookmarkPost = async (postId: string): Promise<boolean> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error('You must be logged in to bookmark posts');
        return false;
      }
      
      const currentUserId = sessionData.session.user.id;
      
      // Check if post is already bookmarked
      const { data: existingBookmark, error: checkError } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('post_id', postId);
      
      if (checkError) {
        console.error('Error checking bookmark:', checkError);
        return false;
      }
      
      if (existingBookmark && existingBookmark.length > 0) {
        // Remove bookmark
        const { error: deleteError } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', existingBookmark[0].id);
        
        if (deleteError) {
          console.error('Error removing bookmark:', deleteError);
          return false;
        }
        
        toast.success('Bookmark removed');
        refetchBookmarks();
        return false;
      } else {
        // Add bookmark
        const { error: insertError } = await supabase
          .from('bookmarks')
          .insert({
            user_id: currentUserId,
            post_id: postId
          });
        
        if (insertError) {
          console.error('Error adding bookmark:', insertError);
          return false;
        }
        
        toast.success('Post bookmarked');
        refetchBookmarks();
        return true;
      }
    } catch (error) {
      console.error('Error in bookmarkPost:', error);
      toast.error('An error occurred with the bookmark');
      return false;
    }
  };

  // Check if a post is bookmarked
  const isBookmarked = useCallback(async (postId: string): Promise<boolean> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return false;
      
      const currentUserId = sessionData.session.user.id;
      
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('post_id', postId);
      
      if (error) {
        console.error('Error checking bookmark status:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error in isBookmarked:', error);
      return false;
    }
  }, []);

  // Delete account
  const deleteAccount = async (): Promise<boolean> => {
    if (!profile || !isCurrentUser) return false;
    
    try {
      // Delete user's profile
      const { error: deleteError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', profile.id);
      
      if (deleteError) {
        console.error('Error deleting profile:', deleteError);
        toast.error('Failed to delete account');
        return false;
      }
      
      // Sign out
      await supabase.auth.signOut();
      
      toast.success('Account deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteAccount:', error);
      toast.error('An error occurred while deleting the account');
      return false;
    }
  };

  return {
    profile,
    posts,
    friends,
    pendingFriendRequests,
    bookmarks,
    isLoading: profileLoading || postsLoading || friendsLoading || bookmarksLoading,
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
    deleteAccount
  };
};
