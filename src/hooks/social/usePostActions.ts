
import { useState } from 'react';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { Post, Comment, Reaction, ReactionType } from '@/types/social';
import { useToast } from '@/hooks/use-toast';
import { extractUserProfileFromResult, isSupabaseError } from './utils';

export const usePostActions = (posts: Post[], setPosts: React.Dispatch<React.SetStateAction<Post[]>>) => {
  const { toast } = useToast();

  const createPost = async (content: string, imageUrl?: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to create posts",
          variant: "destructive"
        });
        return null;
      }
      
      const newPost = {
        user_id: session.user.id,
        content,
        image_url: imageUrl || null
      };
      
      const { data, error } = await supabase
        .from('posts')
        .insert(newPost)
        .select(`
          *,
          user:user_profiles(id, display_name, avatar_url)
        `)
        .single();
        
      if (error) throw error;
      
      const userProfile = extractUserProfileFromResult(
        data.user && !isSupabaseError(data.user) ? data.user : null, 
        session.user.id, 
        "User"
      );
            
      const typedPost: Post = {
        id: data.id,
        user_id: data.user_id,
        content: data.content,
        image_url: data.image_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        user: userProfile,
        reaction_counts: {
          like: 0,
          heart: 0,
          thumbs_up: 0,
          thumbs_down: 0
        }
      };
      
      setPosts(prev => [typedPost, ...prev]);
      return typedPost;
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
      return null;
    }
  };
  
  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
        
      if (error) throw error;
      
      setPosts(prev => prev.filter(post => post.id !== postId));
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
      
      const newComment = {
        post_id: postId,
        user_id: session.user.id,
        content
      };
      
      const { data, error } = await supabase
        .from('comments')
        .insert(newComment)
        .select(`
          *,
          user:user_profiles(id, display_name, avatar_url)
        `)
        .single();
        
      if (error) throw error;
      
      const userProfile = extractUserProfileFromResult(
        data.user && !isSupabaseError(data.user) ? data.user : null, 
        session.user.id, 
        "User"
      );
            
      const typedComment: Comment = {
        id: data.id,
        post_id: data.post_id,
        user_id: data.user_id,
        content: data.content,
        created_at: data.created_at,
        updated_at: data.updated_at,
        user: userProfile
      };
      
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), typedComment]
          };
        }
        return post;
      }));
      
      return typedComment;
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
  
  const addReaction = async (type: ReactionType, postId?: string, commentId?: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to react",
          variant: "destructive"
        });
        return null;
      }
      
      if ((!postId && !commentId) || (postId && commentId)) {
        throw new Error("Invalid reaction target");
      }
      
      const { data: existingReaction, error: checkError } = await supabase
        .from('reactions')
        .select('id')
        .eq('user_id', session.user.id)
        .eq(postId ? 'post_id' : 'comment_id', postId || commentId)
        .eq('type', type)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingReaction) {
        const { error: deleteError } = await supabase
          .from('reactions')
          .delete()
          .eq('id', existingReaction.id);
          
        if (deleteError) throw deleteError;
        
        if (postId) {
          setPosts(prev => prev.map(post => {
            if (post.id === postId && post.reaction_counts) {
              const newCounts = { ...post.reaction_counts };
              newCounts[type]--;
              return { ...post, reaction_counts: newCounts };
            }
            return post;
          }));
        }
        
        return null;
      }
      
      const newReaction = {
        post_id: postId,
        comment_id: commentId,
        user_id: session.user.id,
        type
      };
      
      const { data, error } = await supabase
        .from('reactions')
        .insert(newReaction)
        .select()
        .single();
        
      if (error) throw error;
      
      if (postId) {
        setPosts(prev => prev.map(post => {
          if (post.id === postId && post.reaction_counts) {
            const newCounts = { ...post.reaction_counts };
            newCounts[type]++;
            return { ...post, reaction_counts: newCounts };
          }
          return post;
        }));
      }
      
      return data;
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

  return {
    createPost,
    deletePost,
    addComment,
    addReaction
  };
};
