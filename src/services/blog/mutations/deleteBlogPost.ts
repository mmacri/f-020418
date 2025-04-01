
import { supabase } from "@/integrations/supabase/client";
import { getBlogPostsFromStorage, saveBlogPostsToStorage } from "../utils";

/**
 * Delete a blog post
 */
export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    // First try to delete from Supabase
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting blog post with ID ${id} from Supabase:`, error);
      
      // Fall back to localStorage
      const posts = getBlogPostsFromStorage();
      const filteredPosts = posts.filter(post => String(post.id) !== String(id));
      
      if (filteredPosts.length === posts.length) {
        throw new Error(`Blog post with ID ${id} not found`);
      }
      
      saveBlogPostsToStorage(filteredPosts);
    }
  } catch (error) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
    throw new Error("Failed to delete blog post");
  }
};

// Alias for deleteBlogPost to match the imported function name
export const deletePost = deleteBlogPost;
