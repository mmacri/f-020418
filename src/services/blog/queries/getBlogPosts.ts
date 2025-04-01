
import { BlogPost } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { getBlogPostsFromStorage } from "../utils";
import { mapSupabaseBlogPostToBlogPost } from "../mappers/blogPostMappers";

/**
 * Get all blog posts
 */
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // Try to get from Supabase first
    const { data: supabasePosts, error } = await supabase
      .from('blog_posts')
      .select('*');
    
    if (error) {
      console.error("Error retrieving blog posts from Supabase:", error);
      // Fall back to localStorage
      return getBlogPostsFromStorage();
    }
    
    if (supabasePosts && supabasePosts.length > 0) {
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

      return supabasePosts.map(post => {
        const categoryName = post.category_id && categoryMap.has(post.category_id) 
          ? categoryMap.get(post.category_id) 
          : "General";
          
        return mapSupabaseBlogPostToBlogPost(post, categoryName);
      });
    }
    
    // Fall back to localStorage if no posts found in Supabase
    return getBlogPostsFromStorage();
  } catch (error) {
    console.error("Error retrieving blog posts:", error);
    // Fall back to localStorage
    return getBlogPostsFromStorage();
  }
};

// Alias for getBlogPosts to match the imported function names
export const getAllPosts = getBlogPosts;
