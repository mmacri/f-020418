
import { localStorageKeys } from "@/lib/constants";

// Helper function to get blog posts from localStorage
export const getBlogPostsFromStorage = (): any[] => {
  try {
    const postsData = localStorage.getItem(localStorageKeys.BLOG_POSTS);
    return postsData ? JSON.parse(postsData) : [];
  } catch (error) {
    console.error("Error retrieving blog posts from storage:", error);
    return [];
  }
};

// Helper function to save blog posts to localStorage
export const saveBlogPostsToStorage = (posts: any[]): void => {
  try {
    localStorage.setItem(localStorageKeys.BLOG_POSTS, JSON.stringify(posts));
  } catch (error) {
    console.error("Error saving blog posts to storage:", error);
  }
};
