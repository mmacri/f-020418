
import { BlogPost } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { getBlogPosts } from "./getBlogPosts";
import { mapSupabaseBlogPostToBlogPost } from "../mappers/blogPostMappers";

/**
 * Get scheduled blog posts
 */
export const getScheduledBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data: scheduledPosts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', false)
      .not('scheduled_at', 'is', null)
      .lt('scheduled_at', new Date().toISOString());
    
    if (error) {
      console.error("Error retrieving scheduled blog posts from Supabase:", error);
      // Fall back to localStorage
      const posts = await getBlogPosts();
      const now = new Date().toISOString();
      
      return posts.filter(post => 
        !post.published && 
        (post.scheduledDate || post.scheduled_at) && 
        ((post.scheduledDate && post.scheduledDate <= now) || 
         (post.scheduled_at && post.scheduled_at <= now))
      );
    }
    
    if (scheduledPosts && scheduledPosts.length > 0) {
      // Fetch categories to map category_id to category name
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name');

      const categoryMap = new Map();
      if (categories) {
        categories.forEach((cat: any) => {
          categoryMap.set(cat.id, cat.name);
        });
      }
      
      return scheduledPosts.map(post => {
        const categoryName = post.category_id && categoryMap.has(post.category_id) 
          ? categoryMap.get(post.category_id) 
          : "General";
          
        return mapSupabaseBlogPostToBlogPost(post, categoryName);
      });
    }
    
    return [];
  } catch (error) {
    console.error("Error retrieving scheduled blog posts:", error);
    return [];
  }
};
