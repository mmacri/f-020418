
import { BlogPost } from "./types";
import { getBlogPostsFromStorage } from "./utils";

// Get all blog posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    return getBlogPostsFromStorage();
  } catch (error) {
    console.error("Error retrieving blog posts:", error);
    return [];
  }
};

// Alias for getBlogPosts to match the imported function names
export const getAllPosts = getBlogPosts;

// Get published blog posts
export const getPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const posts = await getBlogPosts();
    return posts.filter(post => post.published);
  } catch (error) {
    console.error("Error retrieving published blog posts:", error);
    return [];
  }
};

// Get blog post by ID
export const getBlogPostById = async (id: number): Promise<BlogPost | null> => {
  try {
    const posts = await getBlogPosts();
    return posts.find(post => post.id === id) || null;
  } catch (error) {
    console.error(`Error retrieving blog post with ID ${id}:`, error);
    return null;
  }
};

// Get blog post by slug
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const posts = await getBlogPosts();
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error(`Error retrieving blog post with slug ${slug}:`, error);
    return null;
  }
};

// Alias for getBlogPostBySlug to match the imported function name
export const getPostBySlug = getBlogPostBySlug;

// Search blog posts
export const searchBlogPosts = async (query: string): Promise<BlogPost[]> => {
  try {
    const posts = await getPublishedBlogPosts();
    const searchTerm = query.toLowerCase().trim();
    
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) || 
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.category.toLowerCase().includes(searchTerm) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  } catch (error) {
    console.error(`Error searching blog posts for "${query}":`, error);
    return [];
  }
};

// Get scheduled blog posts
export const getScheduledBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const posts = await getBlogPosts();
    const now = new Date().toISOString();
    
    return posts.filter(post => 
      !post.published && 
      post.scheduledDate && 
      post.scheduledDate <= now
    );
  } catch (error) {
    console.error("Error retrieving scheduled blog posts:", error);
    return [];
  }
};
