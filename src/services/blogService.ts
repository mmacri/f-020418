
import { localStorageKeys } from "@/lib/constants";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  coverImage?: string;  // Add this property
  category: string;
  categoryId?: number;
  tags?: string[];
  author?: string;
  date: string;
  readTime?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BlogPostInput = Partial<Omit<BlogPost, "id">> & {
  // Required fields
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  
  // Optional fields with defaults
  category?: string;
  image?: string;
  date?: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
};

// Get blog posts from localStorage
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const postsData = localStorage.getItem(localStorageKeys.BLOG_POSTS);
    return postsData ? JSON.parse(postsData) : [];
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

// Add blog post
export const addBlogPost = async (post: BlogPostInput): Promise<BlogPost> => {
  try {
    const posts = await getBlogPosts();
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
      createdAt: now,
      updatedAt: now
    };
    
    localStorage.setItem(
      localStorageKeys.BLOG_POSTS,
      JSON.stringify([...posts, newPost])
    );
    
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
    const posts = await getBlogPosts();
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
    localStorage.setItem(localStorageKeys.BLOG_POSTS, JSON.stringify(posts));
    
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
    const posts = await getBlogPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    
    if (filteredPosts.length === posts.length) {
      return false;
    }
    
    localStorage.setItem(localStorageKeys.BLOG_POSTS, JSON.stringify(filteredPosts));
    return true;
  } catch (error) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
    throw new Error("Failed to delete blog post");
  }
};

// Alias for deleteBlogPost to match the imported function name
export const deletePost = deleteBlogPost;

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
