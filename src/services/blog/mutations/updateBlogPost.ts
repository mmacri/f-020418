
import { BlogPost, BlogPostInput } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { getBlogPostsFromStorage, saveBlogPostsToStorage } from "../utils";
import { mapSupabaseBlogPostToBlogPost } from "../mappers/blogPostMappers";

/**
 * Update an existing blog post
 */
export const updateBlogPost = async (id: string, postInput: Partial<BlogPostInput>): Promise<BlogPost> => {
  try {
    // First try to update in Supabase
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (postInput.title !== undefined) updateData.title = postInput.title;
    if (postInput.slug !== undefined) updateData.slug = postInput.slug;
    if (postInput.excerpt !== undefined) updateData.excerpt = postInput.excerpt;
    if (postInput.content !== undefined) updateData.content = postInput.content;
    if (postInput.image !== undefined || postInput.image_url !== undefined) 
      updateData.image_url = postInput.image || postInput.image_url;
    if (postInput.category_id !== undefined) updateData.category_id = postInput.category_id;
    if (postInput.published !== undefined) {
      updateData.published = postInput.published;
      if (postInput.published && !updateData.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }
    if (postInput.author_id !== undefined) updateData.author_id = postInput.author_id;
    if (postInput.read_time !== undefined) updateData.read_time = postInput.read_time;
    if (postInput.featured !== undefined) updateData.featured = postInput.featured;
    if (postInput.scheduledDate !== undefined || postInput.scheduled_at !== undefined) 
      updateData.scheduled_at = postInput.scheduledDate || postInput.scheduled_at;
    if (postInput.seoTitle !== undefined) updateData.seo_title = postInput.seoTitle;
    if (postInput.seoDescription !== undefined) updateData.seo_description = postInput.seoDescription;
    
    const { data: post, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .maybeSingle();
    
    if (error) {
      console.error(`Error updating blog post with ID ${id} in Supabase:`, error);
      
      // Fall back to localStorage
      const posts = getBlogPostsFromStorage();
      const postIndex = posts.findIndex(post => String(post.id) === String(id));
      
      if (postIndex === -1) {
        throw new Error(`Blog post with ID ${id} not found`);
      }
      
      const updatedPost = {
        ...posts[postIndex],
        ...postInput,
        updatedAt: new Date().toISOString()
      };
      
      posts[postIndex] = updatedPost;
      saveBlogPostsToStorage(posts);
      
      return updatedPost;
    }
    
    // Get the category name if category_id is provided
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
    
    // Map the Supabase row to our BlogPost interface
    return mapSupabaseBlogPostToBlogPost(post, categoryName);
  } catch (error) {
    console.error(`Error updating blog post with ID ${id}:`, error);
    throw new Error("Failed to update blog post");
  }
};

// Alias for updateBlogPost to match the imported function name
export const updatePost = updateBlogPost;
