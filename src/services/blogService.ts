
import { toast } from "@/hooks/use-toast";

// Blog post type definition
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags?: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// Create type without id field
export type BlogPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags?: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

// Mock blog posts data
let BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "How Often Should You Use Recovery Tools?",
    slug: "how-often-should-you-use-recovery-tools",
    excerpt: "Learn the optimal frequency for using different recovery tools to maximize their benefits without overuse.",
    content: `# How Often Should You Use Recovery Tools?

Recovery tools have become increasingly popular among athletes and fitness enthusiasts. From foam rollers to massage guns, these tools can help alleviate muscle soreness, improve mobility, and speed up recovery. But how often should you use them?

## Daily Use Tools

Some recovery tools are gentle enough for daily use:

- **Foam Rollers**: Can be used daily for 5-10 minutes, especially before workouts.
- **Compression Garments**: Can be worn during and after workouts.
- **Recovery Boots**: Typically safe for daily use for 20-30 minutes.

## Moderate Frequency Tools

Other tools should be used more sparingly:

- **Percussion Massage Guns**: 2-3 times per week for 10-15 minutes per session.
- **Vibrating Foam Rollers**: 3-4 times per week for 5-10 minutes.

## High-Intensity Tools

Some recovery methods are more intense and should be used less frequently:

- **Electrical Muscle Stimulation**: 1-2 times per week for 20-30 minutes.
- **Cryotherapy**: 1-2 times per week.

## Listen to Your Body

The most important guideline is to listen to your body. If you experience increased pain or discomfort, reduce frequency and intensity.

Remember that recovery tools complement, but don't replace, proper nutrition, hydration, and sleep.`,
    coverImage: "https://ext.same-assets.com/1001010126/recovery-tools-frequency.jpg",
    author: "Dr. Sarah Johnson",
    tags: ["recovery", "massage guns", "foam rolling", "techniques"],
    published: true,
    createdAt: "2023-02-15T10:30:00Z",
    updatedAt: "2023-02-15T10:30:00Z"
  },
  {
    id: 2,
    title: "6 Effective Massage Gun Techniques for Faster Recovery",
    slug: "6-effective-massage-gun-techniques",
    excerpt: "Discover the most effective ways to use your percussion massage gun to speed up recovery and relieve muscle soreness.",
    content: `# 6 Effective Massage Gun Techniques for Faster Recovery

Percussion massage guns have revolutionized muscle recovery, providing deep tissue massage in a convenient handheld device. Here are six techniques to optimize your results:

## 1. Gliding Technique

Move the massage gun slowly across the muscle in long, sweeping motions. This helps increase blood flow to large muscle groups like quads and hamstrings.

## 2. Spot Treatment

Hold the massage gun on a specific trigger point or knot for 15-30 seconds. Apply moderate pressure but avoid causing pain.

## 3. Circular Motion

Move the massage gun in small circles on areas with particular tension. This helps break up fascial adhesions.

## 4. Pre-Workout Activation

Use the massage gun briefly (30-60 seconds per muscle group) before working out to increase blood flow and prepare muscles for exercise.

## 5. Post-Workout Flush

After exercise, use a sweeping technique across muscles for 1-2 minutes per area to help clear metabolic waste.

## 6. Cross-Friction Technique

Move the massage gun perpendicular to the direction of the muscle fibers to break up scar tissue and improve tissue mobility.

Remember to start with a lower intensity setting and gradually increase as needed. Avoid bony areas, and never use directly on injuries or inflamed areas.`,
    coverImage: "https://ext.same-assets.com/1001010126/massage-gun-techniques.jpg",
    author: "Mike Taylor",
    tags: ["massage guns", "techniques", "recovery", "muscle soreness"],
    published: true,
    createdAt: "2023-01-20T14:45:00Z",
    updatedAt: "2023-01-20T14:45:00Z"
  },
  {
    id: 3,
    title: "The Ultimate Guide to Foam Rolling",
    slug: "ultimate-guide-to-foam-rolling",
    excerpt: "Learn everything you need to know about foam rolling, from basic techniques to advanced routines.",
    content: `# The Ultimate Guide to Foam Rolling

Foam rolling has become a staple in recovery routines. This self-myofascial release technique can improve flexibility, reduce muscle soreness, and enhance performance. Here's your comprehensive guide:

## Choosing the Right Foam Roller

- **Soft Foam Rollers**: Best for beginners and sensitive individuals
- **Medium-Density Rollers**: Good all-purpose options
- **High-Density Rollers**: Provide deeper pressure for experienced users
- **Textured Rollers**: Target trigger points more precisely
- **Vibrating Rollers**: Add vibration therapy for enhanced benefits

## Essential Foam Rolling Techniques

### Lower Body

1. **Calves**: Sit with the roller under your calves, roll from ankle to knee
2. **Hamstrings**: Sit with the roller under your thighs, roll from knee to glutes
3. **Quadriceps**: Lie face down with the roller under your thighs, roll from knee to hip
4. **IT Band**: Lie on your side with the roller under your thigh, roll from knee to hip
5. **Glutes**: Sit on the roller with one ankle crossed over the opposite knee, roll across the glute

### Upper Body

1. **Upper Back**: Lie with the roller under your upper back, roll from mid-back to shoulders
2. **Lats**: Lie on your side with your arm extended, roller under your armpit, roll along the side of your torso
3. **Chest**: Lie face down with the roller under one side of your chest, roll across pectoral muscles

## Best Practices

- Roll slowly (1-2 inches per second)
- Spend 30-60 seconds on each muscle group
- When you find a tender spot, pause for 10-30 seconds
- Breathe deeply and try to relax into the pressure
- Roll before and/or after workouts
- Stay hydrated before and after rolling

## Common Mistakes to Avoid

- Rolling too quickly
- Rolling directly on joints or bones
- Using too much pressure too soon
- Rolling an acute injury
- Bad posture during rolling

Incorporate foam rolling into your routine 3-5 times per week for optimal results.`,
    coverImage: "https://ext.same-assets.com/30303031/foam-roller-guide.jpg",
    author: "Lisa Chen, PT",
    tags: ["foam rolling", "recovery", "techniques", "flexibility"],
    published: true,
    createdAt: "2023-03-05T09:15:00Z",
    updatedAt: "2023-03-05T09:15:00Z"
  }
];

// Store blog posts in localStorage on initialization
const initializeBlogPosts = () => {
  const storedPosts = localStorage.getItem('blogPosts');
  if (!storedPosts) {
    localStorage.setItem('blogPosts', JSON.stringify(BLOG_POSTS));
  } else {
    BLOG_POSTS = JSON.parse(storedPosts);
  }
};

// Initialize on module load
initializeBlogPosts();

// Get all blog posts
export const getAllPosts = async (): Promise<BlogPost[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Load latest from localStorage
  const storedPosts = localStorage.getItem('blogPosts');
  if (storedPosts) {
    BLOG_POSTS = JSON.parse(storedPosts);
  }
  
  return BLOG_POSTS;
};

// Get published blog posts
export const getPublishedPosts = async (): Promise<BlogPost[]> => {
  const posts = await getAllPosts();
  return posts.filter(post => post.published);
};

// Get blog post by slug
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load latest from localStorage
  const storedPosts = localStorage.getItem('blogPosts');
  if (storedPosts) {
    BLOG_POSTS = JSON.parse(storedPosts);
  }
  
  const post = BLOG_POSTS.find(p => p.slug === slug);
  return post || null;
};

// Get blog posts by tag
export const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load latest from localStorage
  const storedPosts = localStorage.getItem('blogPosts');
  if (storedPosts) {
    BLOG_POSTS = JSON.parse(storedPosts);
  }
  
  return BLOG_POSTS.filter(post => 
    post.published && post.tags && post.tags.includes(tag)
  );
};

// Create new blog post
export const createPost = async (post: BlogPostInput): Promise<BlogPost> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Load latest from localStorage
  const storedPosts = localStorage.getItem('blogPosts');
  if (storedPosts) {
    BLOG_POSTS = JSON.parse(storedPosts);
  }
  
  // Create new post with ID
  const newPost: BlogPost = {
    ...post,
    id: BLOG_POSTS.length > 0 ? Math.max(...BLOG_POSTS.map(p => p.id)) + 1 : 1,
  };
  
  // Add to posts and update localStorage
  BLOG_POSTS.push(newPost);
  localStorage.setItem('blogPosts', JSON.stringify(BLOG_POSTS));
  
  toast({
    title: "Post Created",
    description: `"${newPost.title}" has been created`
  });
  
  return newPost;
};

// Update blog post
export const updatePost = async (id: number, updates: Partial<BlogPostInput>): Promise<BlogPost> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Load latest from localStorage
  const storedPosts = localStorage.getItem('blogPosts');
  if (storedPosts) {
    BLOG_POSTS = JSON.parse(storedPosts);
  }
  
  const index = BLOG_POSTS.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Post with ID ${id} not found`);
  }
  
  // Update the post
  const updatedPost: BlogPost = {
    ...BLOG_POSTS[index],
    ...updates,
  };
  
  BLOG_POSTS[index] = updatedPost;
  localStorage.setItem('blogPosts', JSON.stringify(BLOG_POSTS));
  
  toast({
    title: "Post Updated",
    description: `"${updatedPost.title}" has been updated`
  });
  
  return updatedPost;
};

// Delete blog post
export const deletePost = async (id: number): Promise<boolean> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Load latest from localStorage
  const storedPosts = localStorage.getItem('blogPosts');
  if (storedPosts) {
    BLOG_POSTS = JSON.parse(storedPosts);
  }
  
  const index = BLOG_POSTS.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Post with ID ${id} not found`);
  }
  
  const postTitle = BLOG_POSTS[index].title;
  BLOG_POSTS = BLOG_POSTS.filter(p => p.id !== id);
  localStorage.setItem('blogPosts', JSON.stringify(BLOG_POSTS));
  
  toast({
    title: "Post Deleted",
    description: `"${postTitle}" has been deleted`
  });
  
  return true;
};

// Get popular tags
export const getPopularTags = async (): Promise<{tag: string, count: number}[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load latest from localStorage
  const storedPosts = localStorage.getItem('blogPosts');
  if (storedPosts) {
    BLOG_POSTS = JSON.parse(storedPosts);
  }
  
  const tagCounts: {[key: string]: number} = {};
  
  // Count occurrences of each tag
  BLOG_POSTS.filter(post => post.published).forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  // Convert to array and sort by count
  const popularTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
  
  return popularTags;
};
