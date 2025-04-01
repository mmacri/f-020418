
import { BlogPost } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { getBlogPosts } from "./getBlogPosts";
import { mapSupabaseBlogPostToBlogPost } from "../mappers/blogPostMappers";

/**
 * Get published blog posts
 */
export const getPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // Try to get from Supabase first
    const { data: supabasePosts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true);
    
    if (error) {
      console.error("Error retrieving published blog posts from Supabase:", error);
      // Fall back to localStorage
      const posts = await getBlogPosts();
      return posts.filter(post => post.published);
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
    const posts = await getBlogPosts();
    return posts.filter(post => post.published);
  } catch (error) {
    console.error("Error retrieving published blog posts:", error);
    const posts = await getBlogPosts();
    return posts.filter(post => post.published);
  }
};
