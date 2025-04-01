
import { BlogPost } from './types';

// Local storage key for blog posts
const BLOG_POSTS_STORAGE_KEY = 'blog_posts';

/**
 * Get blog posts from local storage
 * @returns Array of blog posts
 */
export const getBlogPostsFromStorage = (): BlogPost[] => {
  try {
    const postsJson = localStorage.getItem(BLOG_POSTS_STORAGE_KEY);
    return postsJson ? JSON.parse(postsJson) : [];
  } catch (error) {
    console.error('Error retrieving blog posts from storage:', error);
    return [];
  }
};

/**
 * Save blog posts to local storage
 * @param posts Array of blog posts to save
 */
export const saveBlogPostsToStorage = (posts: BlogPost[]): void => {
  try {
    localStorage.setItem(BLOG_POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving blog posts to storage:', error);
  }
};

/**
 * Format date string in a human-readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Generate a slug from a title
 * @param title The title to generate a slug from
 * @returns Slug string
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Calculate reading time based on content length
 * @param content The content to calculate reading time for
 * @returns Reading time string
 */
export const calculateReadingTime = (content: string): string => {
  // Average reading speed: 200 words per minute
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
};
