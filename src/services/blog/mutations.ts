
import { BlogPost, BlogPostInput } from "./types";
import { getBlogPostsFromStorage, saveBlogPostsToStorage } from "./utils";
import { getScheduledBlogPosts } from "./queries";

// Add blog post
export const addBlogPost = async (post: BlogPostInput): Promise<BlogPost> => {
  try {
    const posts = getBlogPostsFromStorage();
    const now = new Date().toISOString();
    
    // Set default values for optional fields
    const newPost: BlogPost = {
      ...post,
      id: posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1,
      category: post.category || "Uncategorized",
      image: post.image || post.coverImage || "",
      coverImage: post.coverImage || post.image || "",
      date: post.date || now.split('T')[0],
      author: post.author || "Admin",
      tags: post.tags || [],
      seoTitle: post.seoTitle || post.title,
      seoDescription: post.seoDescription || post.excerpt.substring(0, 160),
      seoKeywords: post.seoKeywords || post.tags || [],
      createdAt: now,
      updatedAt: now
    };
    
    saveBlogPostsToStorage([...posts, newPost]);
    
    return newPost;
  } catch (error) {
    console.error("Error adding blog post:", error);
    throw new Error("Failed to add blog post");
  }
};

// Alias for addBlogPost to match the imported function name
export const createPost = addBlogPost;

// Update blog post
export const updateBlogPost = async (id: number, postData: Partial<BlogPost>): Promise<BlogPost | null> => {
  try {
    const posts = getBlogPostsFromStorage();
    const postIndex = posts.findIndex(post => post.id === id);
    
    if (postIndex === -1) {
      return null;
    }
    
    const updatedPost = {
      ...posts[postIndex],
      ...postData,
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

// Delete blog post
export const deleteBlogPost = async (id: number): Promise<boolean> => {
  try {
    const posts = getBlogPostsFromStorage();
    const filteredPosts = posts.filter(post => post.id !== id);
    
    if (filteredPosts.length === posts.length) {
      return false;
    }
    
    saveBlogPostsToStorage(filteredPosts);
    return true;
  } catch (error) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
    throw new Error("Failed to delete blog post");
  }
};

// Alias for deleteBlogPost to match the imported function name
export const deletePost = deleteBlogPost;

// Publish scheduled blog posts that are due
export const publishScheduledPosts = async (): Promise<number> => {
  try {
    const scheduledPosts = await getScheduledBlogPosts();
    let publishedCount = 0;
    
    for (const post of scheduledPosts) {
      await updateBlogPost(post.id, { 
        published: true,
        date: new Date().toISOString().split('T')[0]
      });
      publishedCount++;
    }
    
    return publishedCount;
  } catch (error) {
    console.error("Error publishing scheduled blog posts:", error);
    return 0;
  }
};
