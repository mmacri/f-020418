
import { BlogPost, BlogPostInput, BlogCategory, BlogTag } from "./types";
import { getBlogPostsFromStorage, saveBlogPostsToStorage } from "./utils";
import { supabase } from "@/integrations/supabase/client";

// Add a new blog post
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
        author: postInput.author || '',
        read_time: postInput.read_time || `${Math.ceil((postInput.content?.length || 0) / 1000)} min read`,
        featured: postInput.featured || false,
        scheduled_for: postInput.scheduledDate || postInput.scheduled_for,
        published_at: postInput.published ? now : null,
        seo_title: postInput.seoTitle,
        seo_description: postInput.seoDescription
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
        image: postInput.image || '',
        coverImage: postInput.coverImage || '',
        published: postInput.published,
        author: postInput.author || '',
        date: postInput.date || new Date().toLocaleDateString(),
        tags: postInput.tags || [],
        createdAt: now,
        updatedAt: now,
        scheduledDate: postInput.scheduledDate,
        seoTitle: postInput.seoTitle,
        seoDescription: postInput.seoDescription,
        seoKeywords: postInput.seoKeywords,
        readTime: postInput.read_time
      };
      
      posts.push(newPost);
      saveBlogPostsToStorage(posts);
      
      return newPost;
    }
    
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image_url,
      category: "General", // Will need to be fetched separately if needed
      category_id: post.category_id,
      published: post.published,
      author: post.author,
      date: post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString(),
      readTime: post.read_time,
      featured: post.featured,
      scheduledDate: post.scheduled_for,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    };
  } catch (error) {
    console.error("Error adding blog post:", error);
    throw new Error("Failed to add blog post");
  }
};

// Alias for addBlogPost to match the imported function name
export const createPost = addBlogPost;

// Update an existing blog post
export const updateBlogPost = async (id: number | string, postInput: Partial<BlogPostInput>): Promise<BlogPost> => {
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
    if (postInput.author !== undefined) updateData.author = postInput.author;
    if (postInput.read_time !== undefined) updateData.read_time = postInput.read_time;
    if (postInput.featured !== undefined) updateData.featured = postInput.featured;
    if (postInput.scheduledDate !== undefined || postInput.scheduled_for !== undefined) 
      updateData.scheduled_for = postInput.scheduledDate || postInput.scheduled_for;
    if (postInput.seoTitle !== undefined) updateData.seo_title = postInput.seoTitle;
    if (postInput.seoDescription !== undefined) updateData.seo_description = postInput.seoDescription;
    
    const { data: post, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        blog_categories(name, slug)
      `)
      .single();
    
    if (error) {
      console.error(`Error updating blog post with ID ${id} in Supabase:`, error);
      
      // Fall back to localStorage
      const posts = getBlogPostsFromStorage();
      const postIndex = posts.findIndex(post => post.id === id);
      
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
    
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image_url,
      category: post.blog_categories ? post.blog_categories.name : "General",
      category_id: post.category_id,
      published: post.published,
      author: post.author,
      date: post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString(),
      readTime: post.read_time,
      featured: post.featured,
      scheduledDate: post.scheduled_for,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    };
  } catch (error) {
    console.error(`Error updating blog post with ID ${id}:`, error);
    throw new Error("Failed to update blog post");
  }
};

// Alias for updateBlogPost to match the imported function name
export const updatePost = updateBlogPost;

// Delete a blog post
export const deleteBlogPost = async (id: number | string): Promise<void> => {
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
      const filteredPosts = posts.filter(post => post.id !== id);
      
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

// Publish scheduled posts
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
      .not('scheduled_for', 'is', null)
      .lt('scheduled_for', now)
      .select();
    
    if (error) {
      console.error("Error publishing scheduled posts in Supabase:", error);
      
      // Fall back to localStorage
      const posts = getBlogPostsFromStorage();
      let publishedCount = 0;
      
      const updatedPosts = posts.map(post => {
        if (!post.published && post.scheduledDate && post.scheduledDate <= now) {
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

// Add a blog category
export const addBlogCategory = async (category: Partial<BlogCategory>): Promise<BlogCategory> => {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .insert({
        name: category.name,
        slug: category.slug,
        description: category.description
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding blog category:", error);
      throw new Error("Failed to add blog category");
    }
    
    return data;
  } catch (error) {
    console.error("Error adding blog category:", error);
    throw new Error("Failed to add blog category");
  }
};

// Update a blog category
export const updateBlogCategory = async (id: string, category: Partial<BlogCategory>): Promise<BlogCategory> => {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .update({
        name: category.name,
        slug: category.slug,
        description: category.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating blog category:", error);
      throw new Error("Failed to update blog category");
    }
    
    return data;
  } catch (error) {
    console.error("Error updating blog category:", error);
    throw new Error("Failed to update blog category");
  }
};

// Delete a blog category
export const deleteBlogCategory = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('blog_categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting blog category:", error);
      throw new Error("Failed to delete blog category");
    }
  } catch (error) {
    console.error("Error deleting blog category:", error);
    throw new Error("Failed to delete blog category");
  }
};
