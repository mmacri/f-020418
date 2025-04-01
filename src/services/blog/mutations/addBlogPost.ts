
import { BlogPost, BlogPostInput } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { getBlogPostsFromStorage, saveBlogPostsToStorage } from "../utils";
import { mapSupabaseBlogPostToBlogPost } from "../mappers/blogPostMappers";

/**
 * Add a new blog post
 */
export const addBlogPost = async (postInput: BlogPostInput): Promise<BlogPost> => {
  try {
    const now = new Date().toISOString();
    
    // First, try to add to Supabase
    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        title: postInput.title,
        slug: postInput.slug,
        excerpt: postInput.excerpt,
        content: postInput.content,
        image_url: postInput.image || postInput.image_url || '',
        category_id: postInput.category_id,
        published: postInput.published,
        author_id: postInput.author_id,
        read_time: postInput.read_time || `${Math.ceil((postInput.content?.length || 0) / 1000)} min read`,
        featured: postInput.featured || false,
        scheduled_at: postInput.scheduledDate || postInput.scheduled_at,
        published_at: postInput.published ? now : null,
        seo_title: postInput.seoTitle,
        seo_description: postInput.seoDescription,
        seo_keywords: postInput.seoKeywords
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding blog post to Supabase:", error);
      
      // Fall back to localStorage
      const posts = getBlogPostsFromStorage();
      
      // Generate a unique ID for the new post
      const newId = posts.length > 0 
        ? Math.max(...posts.map(post => typeof post.id === 'number' ? post.id : 0)) + 1 
        : 1;
      
      const newPost: BlogPost = {
        id: newId,
        title: postInput.title,
        slug: postInput.slug,
        excerpt: postInput.excerpt,
        content: postInput.content,
        category: postInput.category || 'General',
        category_id: postInput.category_id,
        image: postInput.image || '',
        coverImage: postInput.coverImage || '',
        published: postInput.published,
        author: postInput.author || '',
        author_id: postInput.author_id,
        date: postInput.date || new Date().toLocaleDateString(),
        tags: postInput.tags || [],
        createdAt: now,
        updatedAt: now,
        scheduledDate: postInput.scheduledDate,
        scheduled_at: postInput.scheduledDate,
        seoTitle: postInput.seoTitle,
        seoDescription: postInput.seoDescription,
        seoKeywords: postInput.seoKeywords,
        readTime: postInput.read_time,
        read_time: postInput.read_time,
        featured: postInput.featured
      };
      
      posts.push(newPost);
      saveBlogPostsToStorage(posts);
      
      return newPost;
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
    console.error("Error adding blog post:", error);
    throw new Error("Failed to add blog post");
  }
};

// Alias for addBlogPost to match the imported function name
export const createPost = addBlogPost;
