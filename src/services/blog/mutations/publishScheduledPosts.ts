
import { supabase } from "@/integrations/supabase/client";
import { getBlogPostsFromStorage, saveBlogPostsToStorage } from "../utils";

/**
 * Publish scheduled posts
 */
export const publishScheduledPosts = async (): Promise<number> => {
  try {
    const now = new Date().toISOString();
    
    // Try to update in Supabase first
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        published: true,
        published_at: now,
        updated_at: now
      })
      .eq('published', false)
      .not('scheduled_at', 'is', null)
      .lt('scheduled_at', now)
      .select();
    
    if (error) {
      console.error("Error publishing scheduled posts in Supabase:", error);
      
      // Fall back to localStorage
      const posts = getBlogPostsFromStorage();
      let publishedCount = 0;
      
      const updatedPosts = posts.map(post => {
        if (!post.published && (post.scheduledDate || post.scheduled_at) && 
            ((post.scheduledDate && post.scheduledDate <= now) || 
             (post.scheduled_at && post.scheduled_at <= now))) {
          publishedCount++;
          return {
            ...post,
            published: true,
            updatedAt: now
          };
        }
        return post;
      });
      
      if (publishedCount > 0) {
        saveBlogPostsToStorage(updatedPosts);
      }
      
      return publishedCount;
    }
    
    return data ? data.length : 0;
  } catch (error) {
    console.error("Error publishing scheduled posts:", error);
    return 0;
  }
};
