
import { localStorageKeys } from "@/lib/constants";
import { BlogPost } from "./types";

// Helper function to get blog posts from localStorage
export const getBlogPostsFromStorage = (): BlogPost[] => {
  try {
    const postsData = localStorage.getItem(localStorageKeys.BLOG_POSTS);
    
    if (!postsData) {
      return [];
    }
    
    const posts = JSON.parse(postsData);
    
    // Ensure all posts have the required fields
    return posts.map((post: any) => ({
      ...post,
      // Make sure critical fields are never undefined/null
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      published: typeof post.published === 'boolean' ? post.published : false,
      category: post.category || 'General',
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: post.updatedAt || new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error retrieving blog posts from storage:", error);
    return [];
  }
};

// Helper function to save blog posts to localStorage
export const saveBlogPostsToStorage = (posts: BlogPost[]): void => {
  try {
    localStorage.setItem(localStorageKeys.BLOG_POSTS, JSON.stringify(posts));
  } catch (error) {
    console.error("Error saving blog posts to storage:", error);
  }
};

// Helper to initialize demo blog posts if none exist
export const initializeDemoBlogPosts = (): void => {
  const existingPosts = getBlogPostsFromStorage();
  
  if (existingPosts.length === 0) {
    // Add some sample posts if the blog is empty
    const demoPosts: BlogPost[] = [
      {
        id: 1,
        title: "The Ultimate Guide to Foam Rolling for Recovery",
        slug: "foam-rolling-guide",
        excerpt: "Learn how to effectively use foam rollers to enhance muscle recovery, improve mobility, and prevent injuries.",
        content: "<p>Foam rolling has become a popular recovery technique among athletes and fitness enthusiasts. This self-myofascial release technique helps to reduce muscle tension and improve mobility.</p><h2>Benefits of Foam Rolling</h2><p>Regular foam rolling can help with:</p><ul><li>Reducing muscle soreness</li><li>Improving range of motion</li><li>Preventing injury</li><li>Enhancing recovery between workouts</li></ul><p>To get the most out of foam rolling, focus on rolling slowly and pausing on tender areas for 20-30 seconds.</p>",
        category: "Techniques",
        image: "https://ext.same-assets.com/1001010124/foam-roller-guide.jpg",
        published: true,
        author: "Recovery Expert",
        date: "July 8, 2023",
        readTime: "5 min read",
        tags: ["recovery", "mobility", "foam rolling", "techniques"],
        createdAt: "2023-07-08T00:00:00Z",
        updatedAt: "2023-07-08T00:00:00Z"
      }
    ];
    
    saveBlogPostsToStorage(demoPosts);
  }
};

// Call this function to ensure we have at least one demo post
initializeDemoBlogPosts();
