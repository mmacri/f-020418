
import { useState, useEffect } from 'react';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { Post, UserProfile, Comment, Reaction } from '@/types/social';

export const useAdminSocialFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all posts with user information for admin view
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          user:user_profiles(*)
        `)
        .order('created_at', { ascending: false });
      
      if (postsError) {
        console.error('Error fetching all posts:', postsError);
        setError('Failed to fetch posts');
        return;
      }
      
      if (!postsData) {
        setPosts([]);
        return;
      }
      
      // Process posts with comments, reactions, and reaction counts
      const processedPosts = await Promise.all(postsData.map(async (post) => {
        // Get comments for this post
        const { data: commentsData } = await supabase
          .from('comments')
          .select(`
            *,
            user:user_profiles(*)
          `)
          .eq('post_id', post.id)
          .order('created_at', { ascending: true });
        
        // Get reactions for this post
        const { data: reactionsData } = await supabase
          .from('reactions')
          .select('*')
          .eq('post_id', post.id);
        
        // Calculate reaction counts
        const reactionCounts = {
          like: 0,
          heart: 0,
          thumbs_up: 0,
          thumbs_down: 0
        };
        
        if (reactionsData) {
          reactionsData.forEach(reaction => {
            const type = reaction.type as keyof typeof reactionCounts;
            if (reactionCounts[type] !== undefined) {
              reactionCounts[type]++;
            }
          });
        }
        
        // Process user data from post
        let userProfile: UserProfile;
        
        if (post.user && 
            typeof post.user === 'object' && 
            post.user !== null && 
            !('error' in (post.user as object))) {
          userProfile = post.user as UserProfile;
        } else {
          // Fallback if user relation fails
          const { data: userData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', post.user_id)
            .maybeSingle();
          
          userProfile = userData as UserProfile || {
            id: post.user_id,
            display_name: "Unknown User",
            bio: null,
            avatar_url: null,
            is_public: false,
            newsletter_subscribed: false,
            created_at: post.created_at,
            updated_at: post.created_at
          };
        }
        
        // Map comments with proper typing
        const comments = commentsData ? commentsData.map(comment => {
          let commentUser: UserProfile;
          
          if (comment.user && 
              typeof comment.user === 'object' && 
              comment.user !== null && 
              !('error' in (comment.user as object))) {
            commentUser = comment.user as UserProfile;
          } else {
            commentUser = {
              id: comment.user_id,
              display_name: 'Unknown User',
              bio: null,
              avatar_url: null,
              is_public: false,
              newsletter_subscribed: false,
              created_at: comment.created_at,
              updated_at: comment.created_at
            };
          }
          
          return {
            ...comment,
            user: commentUser
          } as Comment;
        }) : [];

        return {
          ...post,
          user: userProfile,
          comments: comments,
          reactions: reactionsData as Reaction[] || [],
          reaction_counts: reactionCounts
        } as Post;
      }));
      
      setPosts(processedPosts);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error in admin social feed:', error);
      setError(`Error loading posts: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const deletePost = async (postId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      
      // Update local state to remove the deleted post
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  };

  return {
    posts,
    isLoading,
    error,
    refreshPosts: fetchAllPosts,
    deletePost
  };
};
