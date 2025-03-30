import { localStorageKeys } from "@/lib/constants";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  coverImage?: string;
  category: string;
  categoryId?: number;
  tags?: string[];
  author?: string;
  date: string;
  readTime?: string;
  published: boolean;
  scheduledDate?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
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
  scheduledDate?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
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
      seoTitle: post.seoTitle || post.title,
      seoDescription: post.seoDescription || post.excerpt.substring(0, 160),
      seoKeywords: post.seoKeywords || post.tags || [],
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

// Generate SEO suggestions for a blog post
export const generateSeoSuggestions = (post: BlogPost): { title: string, description: string, keywords: string[] } => {
  // In a real app, this might call an AI service or use more complex logic
  // For now, we'll implement a simple version
  
  const keywords = [
    ...new Set([
      ...post.tags || [],
      ...post.category.split(/\s+/),
      ...post.title.split(/\s+/).filter(word => word.length > 4)
    ])
  ].slice(0, 10);
  
  return {
    title: post.title.length > 60 ? post.title.substring(0, 57) + '...' : post.title,
    description: post.excerpt.length > 160 ? post.excerpt.substring(0, 157) + '...' : post.excerpt,
    keywords
  };
};

// Analyze content readability (simple implementation)
export const analyzeReadability = (content: string): { score: number, readingTime: string, suggestions: string[] } => {
  const words = content.split(/\s+/).length;
  const sentences = content.split(/[.!?]+/).length;
  const avgWordsPerSentence = words / (sentences || 1);
  
  const readingTimeMinutes = Math.ceil(words / 200); // Assuming 200 words per minute
  
  const suggestions: string[] = [];
  
  if (avgWordsPerSentence > 25) {
    suggestions.push("Consider using shorter sentences for better readability");
  }
  
  if (words < 300) {
    suggestions.push("Consider adding more content for better SEO");
  }
  
  // Simple readability score (0-100)
  const score = Math.min(100, Math.max(0, 100 - (avgWordsPerSentence - 15) * 2));
  
  return {
    score,
    readingTime: readingTimeMinutes === 1 ? "1 minute" : `${readingTimeMinutes} minutes`,
    suggestions
  };
};
