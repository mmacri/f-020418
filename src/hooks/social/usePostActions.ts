import { useState } from 'react';
import { toast } from 'sonner';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { Post, Comment, Reaction, ReactionType } from '@/types/social';
import { uploadProfileImage, uploadPostImage } from './utils';

export const usePostActions = () => {
  const [isUploading, setIsUploading] = useState(false);

  const createPost = async (content: string, imageFile?: File, imageUrl?: string): Promise<Post | null> => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error('Error getting session:', sessionError);
        toast.error('You must be logged in to create a post');
        return null;
      }
      
      const userId = sessionData.session.user.id;
      let finalImageUrl = imageUrl;
      
      if (imageFile) {
        setIsUploading(true);
        
        try {
          const uploadedUrl = await uploadPostImage(imageFile, userId);
          finalImageUrl = uploadedUrl;
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error('Failed to upload image');
          setIsUploading(false);
          return null;
        }
        
        setIsUploading(false);
      }
      
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          content,
          image_url: finalImageUrl || null
        })
        .select('*, user:user_profiles(*)')
        .single();
      
      if (error) {
        console.error('Error creating post:', error);
        toast.error('Failed to create post');
        return null;
      }
      
      toast.success('Post created successfully');
      return {
        ...data,
        user: data.user,
        reactions: [],
        comments: [],
        reaction_counts: {
          like: 0,
          heart: 0,
          thumbs_up: 0,
          thumbs_down: 0
        }
      };
    } catch (error) {
      console.error('Error in createPost:', error);
      toast.error('An error occurred while creating the post');
      return null;
    }
  };

  const deletePost = async (postId: string): Promise<boolean> => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error('Error getting session:', sessionError);
        toast.error('You must be logged in to delete a post');
        return false;
      }
      
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
      return true;
    } catch (error) {
      console.error('Error in deletePost:', error);
      toast.error('An error occurred while deleting the post');
      return false;
    }
  };

  const addComment = async (postId: string, content: string): Promise<Comment | null> => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error('Error getting session:', sessionError);
        toast.error('You must be logged in to comment');
        return null;
      }
      
      const userId = sessionData.session.user.id;
      
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: userId,
          content
        })
        .select('*, user:user_profiles(*)')
        .single();
      
      if (error) {
        console.error('Error adding comment:', error);
        toast.error('Failed to add comment');
        return null;
      }
      
      toast.success('Comment added successfully');
      return {
        ...data,
        user: data.user,
        reactions: [],
        reaction_counts: {
          like: 0,
          heart: 0,
          thumbs_up: 0,
          thumbs_down: 0
        }
      };
    } catch (error) {
      console.error('Error in addComment:', error);
      toast.error('An error occurred while adding the comment');
      return null;
    }
  };

  const addReaction = async (type: ReactionType, postId?: string, commentId?: string): Promise<Reaction | null> => {
    try {
      if (!postId && !commentId) {
        console.error('A postId or commentId must be provided');
        return null;
      }
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error('Error getting session:', sessionError);
        toast.error('You must be logged in to react');
        return null;
      }
      
      const userId = sessionData.session.user.id;
      
      const { data: existingReactions, error: fetchError } = await supabase
        .from('reactions')
        .select('*')
        .eq('user_id', userId)
        .eq(postId ? 'post_id' : 'comment_id', postId || commentId);
      
      if (fetchError) {
        console.error('Error checking existing reactions:', fetchError);
        return null;
      }
      
      if (existingReactions && existingReactions.length > 0) {
        const existingReaction = existingReactions.find(r => r.type === type);
        
        if (existingReaction) {
          const { error: deleteError } = await supabase
            .from('reactions')
            .delete()
            .eq('id', existingReaction.id);
          
          if (deleteError) {
            console.error('Error removing reaction:', deleteError);
            return null;
          }
          
          return null;
        } else {
          const { data: updatedReaction, error: updateError } = await supabase
            .from('reactions')
            .update({ type })
            .eq('id', existingReactions[0].id)
            .select('*')
            .single();
          
          if (updateError) {
            console.error('Error updating reaction:', updateError);
            return null;
          }
          
          return updatedReaction as Reaction;
        }
      }
      
      const { data, error } = await supabase
        .from('reactions')
        .insert({
          post_id: postId || null,
          comment_id: commentId || null,
          user_id: userId,
          type
        })
        .select('*')
        .single();
      
      if (error) {
        console.error('Error adding reaction:', error);
        return null;
      }
      
      return {
        id: data.id,
        post_id: data.post_id,
        comment_id: data.comment_id,
        user_id: data.user_id,
        type: data.type as ReactionType,
        created_at: data.created_at
      };
    } catch (error) {
      console.error('Error in addReaction:', error);
      return null;
    }
  };

  const bookmarkPost = async (postId: string): Promise<boolean> => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error('Error getting session:', sessionError);
        toast.error('You must be logged in to bookmark posts');
        return false;
      }
      
      const userId = sessionData.session.user.id;
      
      const { data: existingBookmark, error: checkError } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', postId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking bookmark:', checkError);
        toast.error('Failed to check bookmark status');
        return false;
      }
      
      if (existingBookmark) {
        const { error: deleteError } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', existingBookmark.id);
        
        if (deleteError) {
          console.error('Error removing bookmark:', deleteError);
          toast.error('Failed to remove bookmark');
          return false;
        }
        
        toast.success('Bookmark removed');
        return false;
      }
      
      const { error: insertError } = await supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          post_id: postId
        });
      
      if (insertError) {
        console.error('Error adding bookmark:', insertError);
        toast.error('Failed to bookmark post');
        return false;
      }
      
      toast.success('Post bookmarked');
      return true;
    } catch (error) {
      console.error('Error in bookmarkPost:', error);
      toast.error('An error occurred while bookmarking the post');
      return false;
    }
  };

  const isBookmarked = async (postId: string): Promise<boolean> => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        return false;
      }
      
      const userId = sessionData.session.user.id;
      
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', postId)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking bookmark status:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error in isBookmarked:', error);
      return false;
    }
  };

  return {
    createPost,
    deletePost,
    addComment,
    addReaction,
    bookmarkPost,
    isBookmarked,
    isUploading
  };
};
