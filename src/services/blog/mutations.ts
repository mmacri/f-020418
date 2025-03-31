
import { BlogPost, BlogPostInput } from "./types";
import { getBlogPostsFromStorage, saveBlogPostsToStorage } from "./utils";

// Add a new blog post
export const addBlogPost = async (postInput: BlogPostInput): Promise<BlogPost> => {
  try {
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scheduledDate: postInput.scheduledDate,
      seoTitle: postInput.seoTitle,
      seoDescription: postInput.seoDescription,
      seoKeywords: postInput.seoKeywords,
      readTime: postInput.readTime
    };
    
    posts.push(newPost);
    saveBlogPostsToStorage(posts);
    
    return newPost;
  } catch (error) {
    console.error("Error adding blog post:", error);
    throw new Error("Failed to add blog post");
  }
};

// Alias for addBlogPost to match the imported function name
export const createPost = addBlogPost;

// Update an existing blog post
export const updateBlogPost = async (id: number, postInput: Partial<BlogPostInput>): Promise<BlogPost> => {
  try {
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
  } catch (error) {
    console.error(`Error updating blog post with ID ${id}:`, error);
    throw new Error("Failed to update blog post");
  }
};

// Alias for updateBlogPost to match the imported function name
export const updatePost = updateBlogPost;

// Delete a blog post
export const deleteBlogPost = async (id: number): Promise<void> => {
  try {
    const posts = getBlogPostsFromStorage();
    const filteredPosts = posts.filter(post => post.id !== id);
    
    if (filteredPosts.length === posts.length) {
      throw new Error(`Blog post with ID ${id} not found`);
    }
    
    saveBlogPostsToStorage(filteredPosts);
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
    const posts = getBlogPostsFromStorage();
    const now = new Date().toISOString();
    let publishedCount = 0;
    
    const updatedPosts = posts.map(post => {
      if (!post.published && post.scheduledDate && post.scheduledDate <= now) {
        publishedCount++;
        return {
          ...post,
          published: true,
          updatedAt: new Date().toISOString()
        };
      }
      return post;
    });
    
    if (publishedCount > 0) {
      saveBlogPostsToStorage(updatedPosts);
    }
    
    return publishedCount;
  } catch (error) {
    console.error("Error publishing scheduled posts:", error);
    return 0;
  }
};
