import { useState } from 'react';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { Post, Comment, Reaction, ReactionType } from '@/types/social';
import { useToast } from '@/hooks/use-toast';
import { uploadPostImage } from './utils';
import { UserProfile } from '@/types/social';

export const usePostActions = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const createPost = async (content: string, imageFile?: File, imageUrl?: string): Promise<Post | null> => {
    try {
      setIsUploading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to create posts",
          variant: "destructive"
        });
        return null;
      }
      
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadPostImage(imageFile, session.user.id);
      }
      
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: session.user.id,
          content,
          image_url: finalImageUrl
        })
        .select(`
          *,
          user:user_profiles(*)
        `)
        .single();
      
      if (error) {
        throw error;
      }
      
      const newPost: Post = {
        id: data.id,
        user_id: data.user_id,
        content: data.content,
        image_url: data.image_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        user: data.user as any as UserProfile,
        comments: [],
        reactions: [],
        reaction_counts: {
          like: 0,
          heart: 0,
          thumbs_up: 0,
          thumbs_down: 0
        }
      };
      
      toast({
        title: "Success",
        description: "Your post has been created"
      });
      
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deletePost = async (postId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Post deleted successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
      return false;
    }
  };

  const addComment = async (postId: string, content: string): Promise<Comment | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to comment",
          variant: "destructive"
        });
        return null;
      }
      
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: session.user.id,
          content
        })
        .select(`
          *,
          user:user_profiles(*)
        `)
        .single();
      
      if (error) throw error;
      
      const newComment: Comment = {
        id: data.id,
        post_id: data.post_id,
        user_id: data.user_id,
        content: data.content,
        created_at: data.created_at,
        updated_at: data.updated_at,
        user: data.user as any as UserProfile
      };
      
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
      return null;
    }
  };

  const addReaction = async (
    type: ReactionType, 
    postId?: string, 
    commentId?: string
  ): Promise<Reaction | null> => {
    try {
      if (!postId && !commentId) {
        throw new Error("Either postId or commentId must be provided");
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to react",
          variant: "destructive"
        });
        return null;
      }
      
      const { data: existingReactions, error: fetchError } = await supabase
        .from('reactions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('type', type)
        .eq(postId ? 'post_id' : 'comment_id', postId || commentId);
      
      if (fetchError) throw fetchError;
      
      if (existingReactions && existingReactions.length > 0) {
        const { error: deleteError } = await supabase
          .from('reactions')
          .delete()
          .eq('id', existingReactions[0].id);
        
        if (deleteError) throw deleteError;
        
        return null;
      }
      
      const { data, error } = await supabase
        .from('reactions')
        .insert({
          post_id: postId,
          comment_id: commentId,
          user_id: session.user.id,
          type
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newReaction: Reaction = {
        id: data.id,
        post_id: data.post_id,
        comment_id: data.comment_id,
        user_id: data.user_id,
        type: data.type as ReactionType,
        created_at: data.created_at
      };
      
      return newReaction;
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Error",
        description: "Failed to add reaction",
        variant: "destructive"
      });
      return null;
    }
  };

  const bookmarkPost = async (postId: string): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to bookmark posts",
          variant: "destructive"
        });
        return false;
      }
      
      const { data: bookmarkData, error: bookmarkError } = await supabase.rpc(
        'get_bookmark_by_post_and_user',
        { 
          p_user_id: session.user.id,
          p_post_id: postId
        }
      );
      
      if (bookmarkError) throw bookmarkError;
      
      if (bookmarkData && bookmarkData.length > 0) {
        const { error: deleteError } = await supabase.rpc(
          'delete_bookmark',
          { 
            p_user_id: session.user.id,
            p_post_id: postId
          }
        );
        
        if (deleteError) throw deleteError;
        
        toast({
          title: "Bookmark removed",
          description: "Post removed from your bookmarks"
        });
        
        return false;
      }
      
      const { error: insertError } = await supabase.rpc(
        'insert_bookmark',
        { 
          p_user_id: session.user.id,
          p_post_id: postId
        }
      );
      
      if (insertError) throw insertError;
      
      toast({
        title: "Bookmarked",
        description: "Post added to your bookmarks"
      });
      
      return true;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to bookmark post",
        variant: "destructive"
      });
      return false;
    }
  };

  const isBookmarked = async (postId: string): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return false;
      }
      
      const { data, error } = await supabase.rpc(
        'get_bookmark_by_post_and_user',
        { 
          p_user_id: session.user.id,
          p_post_id: postId
        }
      );
      
      if (error) throw error;
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking bookmark status:', error);
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
