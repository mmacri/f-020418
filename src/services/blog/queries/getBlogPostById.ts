
import { BlogPost } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { getBlogPosts } from "./getBlogPosts";
import { mapSupabaseBlogPostToBlogPost } from "../mappers/blogPostMappers";

/**
 * Get blog post by ID
 */
export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    // Try to get from Supabase first
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error(`Error retrieving blog post with ID ${id} from Supabase:`, error);
      // Fall back to localStorage
      const posts = await getBlogPosts();
      return posts.find(post => String(post.id) === String(id)) || null;
    }
    
    if (post) {
      // Get the category name
      let categoryName = "General";
      if (post.category_id) {
        const { data: category } = await supabase
          .from('categories')
          .select('name')
          .eq('id', post.category_id)
          .maybeSingle();
        
        if (category) {
          categoryName = category.name;
        }
      }
      
      return mapSupabaseBlogPostToBlogPost(post, categoryName);
    }
    
    // Fall back to localStorage if no post found in Supabase
    const posts = await getBlogPosts();
    return posts.find(post => String(post.id) === String(id)) || null;
  } catch (error) {
    console.error(`Error retrieving blog post with ID ${id}:`, error);
    return null;
  }
};
