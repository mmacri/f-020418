
import { useState, useEffect, useCallback } from 'react';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { Post, UserProfile, Comment, Reaction } from '@/types/social';

export const useProfilePosts = (userId?: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async (profileId?: string) => {
    if (!profileId) return;
    
    try {
      setIsLoading(true);
      
      // Fetch user's posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          user:user_profiles(*)
        `)
        .eq('user_id', profileId)
        .order('created_at', { ascending: false });
      
      if (postsError) {
        console.error('Error fetching posts:', postsError);
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
        if (post.user && typeof post.user === 'object' && !('error' in post.user)) {
          userProfile = post.user as UserProfile;
        } else {
          // Fallback if user relation fails
          const { data: userData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', post.user_id)
            .single();
          
          userProfile = userData as UserProfile;
        }
        
        // Map comments with proper typing
        const comments = commentsData ? commentsData.map(comment => {
          let commentUser: UserProfile;
          if (comment.user && typeof comment.user === 'object' && !('error' in comment.user)) {
            commentUser = comment.user as UserProfile;
          } else {
            // We'll use a placeholder user if relation fails
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
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(userId);
  }, [fetchPosts, userId]);

  return {
    posts,
    isLoading,
    refetchPosts: () => fetchPosts(userId)
  };
};
