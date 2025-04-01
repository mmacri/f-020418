
import { BlogPost } from "../types";
import { getPublishedBlogPosts } from "./getPublishedBlogPosts";

/**
 * Search blog posts
 */
export const searchBlogPosts = async (searchTerm: string): Promise<BlogPost[]> => {
  try {
    const posts = await getPublishedBlogPosts();
    const query = searchTerm.toLowerCase().trim();
    
    return posts.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.excerpt.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      (post.category && post.category.toLowerCase().includes(query)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  } catch (error) {
    console.error(`Error searching blog posts for "${searchTerm}":`, error);
    return [];
  }
};
