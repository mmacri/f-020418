
import { useState, useEffect, useCallback } from 'react';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { Bookmark, Post, UserProfile, Comment, Reaction } from '@/types/social';

export const useProfileBookmarks = (userId?: string, isCurrentUser: boolean = false) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = useCallback(async (profileId?: string) => {
    if (!profileId || !isCurrentUser) {
      setBookmarks([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Fetch bookmarks for current user
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select(`
          *,
          post:posts(*)
        `)
        .eq('user_id', profileId);
      
      if (bookmarksError) {
        console.error('Error fetching bookmarks:', bookmarksError);
        return;
      }
      
      if (!bookmarksData) {
        setBookmarks([]);
        return;
      }
      
      // Process bookmarks with post data
      const processedBookmarks = await Promise.all(bookmarksData.map(async (bookmark) => {
        if (!bookmark.post) {
          return {
            id: bookmark.id,
            user_id: bookmark.user_id,
            post_id: bookmark.post_id,
            created_at: bookmark.created_at
          } as Bookmark;
        }
        
        // Get the post author's profile
        const { data: postUserData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', bookmark.post.user_id)
          .single();
        
        // Get comments for this post
        const { data: commentsData } = await supabase
          .from('comments')
          .select(`
            *,
            user:user_profiles(*)
          `)
          .eq('post_id', bookmark.post.id)
          .order('created_at', { ascending: true });
        
        // Get reactions for this post
        const { data: reactionsData } = await supabase
          .from('reactions')
          .select('*')
          .eq('post_id', bookmark.post.id);
        
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
        
        // Process comments with proper typing
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
        
        const postWithDetails: Post = {
          ...bookmark.post,
          user: postUserData as UserProfile,
          comments: comments,
          reactions: reactionsData as Reaction[] || [],
          reaction_counts: reactionCounts
        };
        
        return {
          id: bookmark.id,
          user_id: bookmark.user_id,
          post_id: bookmark.post_id,
          created_at: bookmark.created_at,
          post: postWithDetails
        } as Bookmark;
      }));
      
      setBookmarks(processedBookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isCurrentUser]);

  useEffect(() => {
    fetchBookmarks(userId);
  }, [fetchBookmarks, userId]);

  return {
    bookmarks,
    isLoading,
    refetchBookmarks: () => fetchBookmarks(userId)
  };
};
