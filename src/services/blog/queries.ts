
import { BlogPost, BlogCategory, BlogTag } from "./types";
import { getBlogPostsFromStorage } from "./utils";
import { supabase } from "@/integrations/supabase/client";

// Get all blog posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // Try to get from Supabase first
    const { data: supabasePosts, error } = await supabase
      .from('blog_posts')
      .select('*');
    
    if (error) {
      console.error("Error retrieving blog posts from Supabase:", error);
      // Fall back to localStorage
      return getBlogPostsFromStorage();
    }
    
    if (supabasePosts && supabasePosts.length > 0) {
      // Fetch categories to map category_id to category name
      const { data: categories } = await supabase
        .from('blog_categories')
        .select('*');

      const categoryMap = new Map();
      if (categories) {
        categories.forEach((cat: any) => {
          categoryMap.set(cat.id, cat.name);
        });
      }

      return supabasePosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content || "",
        image: post.image_url || "",
        image_url: post.image_url || "",
        category: categoryMap.get(post.category_id) || "General",
        category_id: post.category_id,
        published: post.published,
        author: post.author || "",
        author_id: post.author_id,
        date: post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString(),
        readTime: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
        read_time: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
        featured: post.featured || false,
        scheduledDate: post.scheduled_at,
        scheduled_at: post.scheduled_at,
        createdAt: post.created_at,
        created_at: post.created_at,
        updatedAt: post.updated_at,
        updated_at: post.updated_at,
        published_at: post.published_at
      }));
    }
    
    // Fall back to localStorage if no posts found in Supabase
    return getBlogPostsFromStorage();
  } catch (error) {
    console.error("Error retrieving blog posts:", error);
    // Fall back to localStorage
    return getBlogPostsFromStorage();
  }
};

// Alias for getBlogPosts to match the imported function names
export const getAllPosts = getBlogPosts;

// Get published blog posts
export const getPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // Try to get from Supabase first
    const { data: supabasePosts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true);
    
    if (error) {
      console.error("Error retrieving published blog posts from Supabase:", error);
      // Fall back to localStorage
      const posts = await getBlogPosts();
      return posts.filter(post => post.published);
    }
    
    if (supabasePosts && supabasePosts.length > 0) {
      // Fetch categories to map category_id to category name
      const { data: categories } = await supabase
        .from('blog_categories')
        .select('*');

      const categoryMap = new Map();
      if (categories) {
        categories.forEach((cat: any) => {
          categoryMap.set(cat.id, cat.name);
        });
      }
      
      return supabasePosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content || "",
        image: post.image_url || "",
        image_url: post.image_url || "",
        category: categoryMap.get(post.category_id) || "General",
        category_id: post.category_id,
        published: post.published,
        author: post.author || "",
        author_id: post.author_id,
        date: post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString(),
        readTime: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
        read_time: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
        featured: post.featured || false,
        createdAt: post.created_at,
        created_at: post.created_at,
        updatedAt: post.updated_at,
        updated_at: post.updated_at
      }));
    }
    
    // Fall back to localStorage if no posts found in Supabase
    const posts = await getBlogPosts();
    return posts.filter(post => post.published);
  } catch (error) {
    console.error("Error retrieving published blog posts:", error);
    const posts = await getBlogPosts();
    return posts.filter(post => post.published);
  }
};

// Get blog post by ID
export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    // Try to get from Supabase first
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error retrieving blog post with ID ${id} from Supabase:`, error);
      // Fall back to localStorage
      const posts = await getBlogPosts();
      return posts.find(post => String(post.id) === String(id)) || null;
    }
    
    if (post) {
      // Get the category name
      let categoryName = "General";
      if (post.category_id) {
        const { data: category } = await supabase
          .from('blog_categories')
          .select('name')
          .eq('id', post.category_id)
          .single();
        
        if (category) {
          categoryName = category.name;
        }
      }
      
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content || "",
        image: post.image_url || "",
        image_url: post.image_url || "",
        category: categoryName,
        category_id: post.category_id,
        published: post.published,
        author: post.author || "",
        author_id: post.author_id,
        date: post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString(),
        readTime: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
        read_time: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
        featured: post.featured || false,
        createdAt: post.created_at,
        created_at: post.created_at,
        updatedAt: post.updated_at,
        updated_at: post.updated_at
      };
    }
    
    // Fall back to localStorage if no post found in Supabase
    const posts = await getBlogPosts();
    return posts.find(post => String(post.id) === String(id)) || null;
  } catch (error) {
    console.error(`Error retrieving blog post with ID ${id}:`, error);
    return null;
  }
};

// Get blog post by slug
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    // Try to get from Supabase first
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`Error retrieving blog post with slug ${slug} from Supabase:`, error);
      // Fall back to localStorage
      const posts = await getBlogPosts();
      return posts.find(post => post.slug === slug) || null;
    }
    
    if (post) {
      // Get the category name
      let categoryName = "General";
      if (post.category_id) {
        const { data: category } = await supabase
          .from('blog_categories')
          .select('name')
          .eq('id', post.category_id)
          .single();
        
        if (category) {
          categoryName = category.name;
        }
      }
      
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content || "",
        image: post.image_url || "",
        image_url: post.image_url || "",
        category: categoryName,
        category_id: post.category_id,
        published: post.published,
        author: post.author || "",
        author_id: post.author_id,
        date: post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString(),
        readTime: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
        read_time: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
        featured: post.featured || false,
        createdAt: post.created_at,
        created_at: post.created_at,
        updatedAt: post.updated_at,
        updated_at: post.updated_at
      };
    }
    
    // Fall back to localStorage if no post found in Supabase
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
      (post.category && post.category.toLowerCase().includes(searchTerm)) ||
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
    const { data: scheduledPosts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', false)
      .not('scheduled_at', 'is', null)
      .lt('scheduled_at', new Date().toISOString());
    
    if (error) {
      console.error("Error retrieving scheduled blog posts from Supabase:", error);
      // Fall back to localStorage
      const posts = await getBlogPosts();
      const now = new Date().toISOString();
      
      return posts.filter(post => 
        !post.published && 
        (post.scheduledDate || post.scheduled_at) && 
        (post.scheduledDate <= now || post.scheduled_at <= now)
      );
    }
    
    if (scheduledPosts && scheduledPosts.length > 0) {
      // Fetch categories to map category_id to category name
      const { data: categories } = await supabase
        .from('blog_categories')
        .select('*');

      const categoryMap = new Map();
      if (categories) {
        categories.forEach((cat: any) => {
          categoryMap.set(cat.id, cat.name);
        });
      }
      
      return scheduledPosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content || "",
        image: post.image_url || "",
        image_url: post.image_url || "",
        category: categoryMap.get(post.category_id) || "General",
        category_id: post.category_id,
        published: post.published,
        author: post.author || "",
        author_id: post.author_id,
        date: post.created_at ? new Date(post.created_at).toLocaleDateString() : "",
        readTime: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
        read_time: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
        featured: post.featured || false,
        scheduledDate: post.scheduled_at,
        scheduled_at: post.scheduled_at,
        createdAt: post.created_at,
        created_at: post.created_at,
        updatedAt: post.updated_at,
        updated_at: post.updated_at
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error retrieving scheduled blog posts:", error);
    return [];
  }
};

// Get blog categories
export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  try {
    const { data: categories, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error retrieving blog categories:", error);
      return [];
    }
    
    return categories as BlogCategory[];
  } catch (error) {
    console.error("Error retrieving blog categories:", error);
    return [];
  }
};
