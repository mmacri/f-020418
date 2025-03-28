
import { toast } from "@/hooks/use-toast";

// Blog post type definition
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  author?: string;
  authorImage?: string;
  authorBio?: string;
  videoId?: string;
  videoTitle?: string;
  videoDescription?: string;
  tags?: string[];
  featured?: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock blog post data
let BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "How Often Should You Use Recovery Tools?",
    slug: "recovery-frequency",
    excerpt: "Finding the optimal frequency for massage guns, foam rollers, and other recovery modalities for your specific needs.",
    content: `
      <p class="text-lg font-medium text-gray-800 mb-6">
        "How often should I use recovery tools?" is one of the most common questions we receive from our community. Whether it's about massage guns, foam rollers, compression gear, or other recovery modalities, finding the right frequency is crucial for maximizing benefits without overdoing it.
      </p>

      <p class="text-gray-700 mb-6">
        This guide breaks down the optimal usage frequency for different recovery tools based on scientific research, expert recommendations, and real-world application. We'll cover specific protocols for various fitness levels, activity types, and recovery needs.
      </p>

      <div class="bg-indigo-50 p-6 rounded-lg my-8">
        <h3 class="font-bold text-xl mb-3">Coming Soon</h3>
        <p class="text-gray-700">
          We're currently finalizing this practical guide on recovery tool frequency. Check back soon for the complete article, or subscribe to our newsletter to be notified when it's published.
        </p>
      </div>
    `,
    image: "https://ext.same-assets.com/4181642789/575270868.jpeg",
    category: "Recovery Science",
    date: "April 12, 2023",
    readTime: "5 min read",
    author: "Elena Rodriguez",
    authorImage: "https://ext.same-assets.com/2651616194/3622592620.jpeg",
    authorBio: "Fitness recovery specialist with expertise in optimizing recovery protocols for athletes of all levels.",
    tags: ["recovery frequency", "massage guns", "foam rollers", "recovery tools"],
    featured: false,
    published: true,
    createdAt: "2023-04-10T09:30:00Z",
    updatedAt: "2023-04-11T14:15:00Z"
  },
  {
    id: 2,
    title: "6 Effective Massage Gun Techniques for Faster Recovery",
    slug: "massage-gun-techniques",
    excerpt: "Master these techniques to maximize your percussion therapy results and enhance muscle recovery.",
    content: `
      <p class="text-lg font-medium text-gray-800 mb-6">
        Whether you're a professional athlete, fitness enthusiast, or someone dealing with everyday muscle tension,
        a massage gun can be a game-changer for your recovery routine. But simply turning it on and moving it around
        randomly won't deliver the best results. In this guide, we'll explore effective techniques to maximize the
        benefits of your percussion therapy device.
      </p>

      <div class="bg-indigo-50 p-6 rounded-lg my-8">
        <h3 class="font-bold text-xl mb-3">Important Safety Notes</h3>
        <ul class="list-disc pl-6 space-y-2 text-gray-700">
          <li>Never use a massage gun directly on bones, joints, or nerves</li>
          <li>Avoid using on injuries, inflamed areas, or broken skin</li>
          <li>Start with the lowest intensity setting and gradually increase as needed</li>
          <li>Limit treatment to 2 minutes per muscle group</li>
          <li>If you experience pain (beyond normal muscle soreness), stop immediately</li>
          <li>Consult a healthcare professional if you have medical conditions or concerns</li>
        </ul>
      </div>

      <h2 class="text-3xl font-bold text-gray-800 my-8">Essential Massage Gun Techniques</h2>

      <!-- Technique 1 -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
        <h3 class="text-2xl font-bold text-indigo-800 mb-4">1. Float and Glide</h3>
        <div class="flex flex-col md:flex-row gap-6 mb-4">
          <div class="md:w-1/3">
            <img src="https://ext.same-assets.com/198595764/1658350751.jpeg" alt="Float and Glide Technique" class="rounded-lg shadow-sm">
          </div>
          <div class="md:w-2/3">
            <p class="text-gray-700 mb-4">
              The most basic and versatile technique. Without applying additional pressure, let the massage gun float along
              the muscle, gliding slowly (about 1-2 inches per second). This distributes the percussion evenly throughout the muscle tissue.
            </p>
            <h4 class="font-bold mt-4 mb-2">When to use:</h4>
            <p class="text-gray-700">
              Ideal for warming up muscles pre-workout, general muscle maintenance, or as a starting point before using more targeted techniques.
            </p>
          </div>
        </div>
        <div class="bg-gray-50 p-4 rounded text-sm text-gray-600">
          <strong>Pro Tip:</strong> Keep the massage gun perpendicular to the muscle rather than at an angle for optimal percussion depth.
        </div>
      </div>

      <!-- Technique 2 -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
        <h3 class="text-2xl font-bold text-indigo-800 mb-4">2. Press and Hold</h3>
        <div class="flex flex-col md:flex-row gap-6 mb-4">
          <div class="md:w-1/3">
            <img src="https://ext.same-assets.com/1926211595/4269912841.jpeg" alt="Press and Hold Technique" class="rounded-lg shadow-sm">
          </div>
          <div class="md:w-2/3">
            <p class="text-gray-700 mb-4">
              For targeting specific knots or trigger points, apply the massage gun directly to the spot and hold with light to medium pressure for 15-30 seconds. The sustained percussion helps release stubborn tension points.
            </p>
            <h4 class="font-bold mt-4 mb-2">When to use:</h4>
            <p class="text-gray-700">
              Perfect for addressing specific areas of tension, muscle knots, or trigger points that don't release with regular movement techniques.
            </p>
          </div>
        </div>
        <div class="bg-gray-50 p-4 rounded text-sm text-gray-600">
          <strong>Pro Tip:</strong> Start with lower pressure and gradually increase to avoid discomfort. Use a round or flat attachment for this technique.
        </div>
      </div>
    `,
    image: "https://ext.same-assets.com/198595764/1658350751.jpeg",
    category: "Techniques",
    date: "May 14, 2023",
    readTime: "8 min read",
    author: "Dr. Sarah Johnson",
    authorImage: "https://ext.same-assets.com/2783942035/2491380635.jpeg",
    authorBio: "Physical therapist with over 12 years of experience specializing in sports injury rehabilitation and recovery protocols.",
    videoId: "xMbU2JK9x50",
    videoTitle: "Massage Gun Techniques Demonstration",
    videoDescription: "Watch this video tutorial to see these techniques in action and learn proper form:",
    tags: ["massage gun", "percussion therapy", "recovery techniques"],
    featured: true,
    published: true,
    createdAt: "2023-05-10T11:20:00Z",
    updatedAt: "2023-05-13T16:45:00Z"
  },
  {
    id: 3,
    title: "The Ultimate Guide to Foam Rolling",
    slug: "foam-rolling-guide",
    excerpt: "Learn proper foam rolling techniques to relieve muscle tension and improve flexibility.",
    content: `
      <p class="text-lg mb-4">
        Foam rolling is one of the most effective self-care techniques for relieving muscle tension, improving flexibility, and enhancing recovery. This technique, also known as self-myofascial release (SMR), has gained popularity among athletes, fitness enthusiasts, and physical therapists for its ability to target tight fascia—the connective tissue surrounding muscles—and improve overall mobility.
      </p>
      <h2 class="text-2xl font-bold mt-8 mb-4">What is Foam Rolling?</h2>
      <p class="mb-4">
        Foam rolling involves using a cylindrical foam roller to apply pressure to specific areas of your body. By rolling the targeted muscle group over the foam roller, you apply pressure that helps release tightness and adhesions in the fascia—the thin layer of connective tissue that surrounds your muscles.
      </p>
      <p class="mb-6">
        Think of your muscles and fascia like a wool sweater that's been bunched up and twisted. Foam rolling helps to smooth everything back out, allowing your muscles to move more freely and efficiently.
      </p>
      <h2 class="text-2xl font-bold mt-8 mb-4">Key Benefits of Foam Rolling</h2>
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2"><strong>Reduces Muscle Soreness:</strong> Multiple studies have shown that foam rolling can significantly reduce delayed onset muscle soreness (DOMS) after intense exercise.</li>
        <li class="mb-2"><strong>Improves Blood Circulation:</strong> The pressure applied during foam rolling helps increase blood flow to muscles, delivering more oxygen and nutrients.</li>
        <li class="mb-2"><strong>Enhances Flexibility:</strong> Regular foam rolling can improve joint range of motion and flexibility without negatively impacting muscle performance.</li>
        <li class="mb-2"><strong>Prevents Injury:</strong> Addressing muscle imbalances and restrictions through regular foam rolling can help prevent common exercise-related injuries.</li>
      </ul>
    `,
    image: "https://ext.same-assets.com/1001010124/foam-roller-guide.jpg",
    category: "Techniques",
    date: "July 8, 2023",
    readTime: "12 min read",
    author: "Dr. Sarah Johnson",
    authorImage: "https://ext.same-assets.com/2783942035/2491380635.jpeg",
    authorBio: "Physical therapist with over 12 years of experience specializing in sports injury rehabilitation and recovery protocols.",
    videoId: "M8J6SZ7Y4RI",
    videoTitle: "Foam Rolling Techniques for Total Body Recovery",
    videoDescription: "This step-by-step guide demonstrates proper foam rolling techniques for all major muscle groups.",
    tags: ["foam rolling", "myofascial release", "recovery techniques", "flexibility"],
    featured: false,
    published: true,
    createdAt: "2023-07-05T10:15:00Z",
    updatedAt: "2023-07-07T13:30:00Z"
  }
];

// Get all blog posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...BLOG_POSTS].filter(post => post.published);
};

// Get featured blog posts
export const getFeaturedBlogPosts = async (): Promise<BlogPost[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return [...BLOG_POSTS].filter(post => post.published && post.featured);
};

// Get blog post by ID
export const getBlogPostById = async (id: number): Promise<BlogPost | null> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const post = BLOG_POSTS.find(p => p.id === id && p.published);
  return post || null;
};

// Get blog post by slug
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const post = BLOG_POSTS.find(p => p.slug === slug && p.published);
  return post || null;
};

// Get blog posts by category
export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
  return [...BLOG_POSTS].filter(
    p => p.published && p.category.toLowerCase().replace(/\s+/g, '-') === normalizedCategory
  );
};

// Create new blog post
export const createBlogPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create new blog post with ID and dates
  const newPost: BlogPost = {
    ...post,
    id: Math.max(...BLOG_POSTS.map(p => p.id)) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  BLOG_POSTS.push(newPost);
  
  toast({
    title: "Blog post created",
    description: `"${newPost.title}" has been added successfully`
  });
  
  return newPost;
};

// Update blog post
export const updateBlogPost = async (id: number, updates: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>): Promise<BlogPost> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = BLOG_POSTS.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Blog post with ID ${id} not found`);
  }
  
  // Update the blog post
  const updatedPost: BlogPost = {
    ...BLOG_POSTS[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  BLOG_POSTS[index] = updatedPost;
  
  toast({
    title: "Blog post updated",
    description: `"${updatedPost.title}" has been updated successfully`
  });
  
  return updatedPost;
};

// Delete blog post
export const deleteBlogPost = async (id: number): Promise<boolean> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = BLOG_POSTS.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Blog post with ID ${id} not found`);
  }
  
  const postTitle = BLOG_POSTS[index].title;
  BLOG_POSTS = BLOG_POSTS.filter(p => p.id !== id);
  
  toast({
    title: "Blog post deleted",
    description: `"${postTitle}" has been removed successfully`
  });
  
  return true;
};

// Get posts by search term
export const searchBlogPosts = async (searchTerm: string): Promise<BlogPost[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const term = searchTerm.toLowerCase();
  return [...BLOG_POSTS].filter(post => 
    post.published && (
      post.title.toLowerCase().includes(term) || 
      post.excerpt.toLowerCase().includes(term) || 
      post.content.toLowerCase().includes(term) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term)))
    )
  );
};
