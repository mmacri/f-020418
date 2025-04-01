
import { BlogPost } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { getBlogPosts } from "./getBlogPosts";
import { mapSupabaseBlogPostToBlogPost } from "../mappers/blogPostMappers";

/**
 * Get blog post by slug
 */
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    // Try to get from Supabase first
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (error) {
      console.error(`Error retrieving blog post with slug ${slug} from Supabase:`, error);
      // Fall back to localStorage
      const posts = await getBlogPosts();
      return posts.find(post => post.slug === slug) || null;
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
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error(`Error retrieving blog post with slug ${slug}:`, error);
    return null;
  }
};

// Alias for getBlogPostBySlug to match the imported function names
export const getPostBySlug = getBlogPostBySlug;
