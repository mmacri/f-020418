
import { BlogPost, BlogCategory, BlogTag } from "./types";
import { getBlogPostsFromStorage } from "./utils";
import { supabase } from "@/integrations/supabase/client";

// Get all blog posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // Try to get from Supabase first
    const { data: supabasePosts, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories(name, slug)
      `);
    
    if (error) {
      console.error("Error retrieving blog posts from Supabase:", error);
      // Fall back to localStorage
      return getBlogPostsFromStorage();
    }
    
    if (supabasePosts && supabasePosts.length > 0) {
      return supabasePosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content || "",
        image: post.image_url || "",
        category: post.blog_categories ? post.blog_categories.name : "General",
        category_id: post.category_id,
        published: post.published,
        author: post.author || "",
        date: post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString(),
        readTime: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
        featured: post.featured || false,
        scheduledDate: post.scheduled_for,
        createdAt: post.created_at,
        updatedAt: post.updated_at
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
      .select(`
        *,
        blog_categories(name, slug)
      `)
      .eq('published', true);
    
    if (error) {
      console.error("Error retrieving published blog posts from Supabase:", error);
      // Fall back to localStorage
      const posts = await getBlogPosts();
      return posts.filter(post => post.published);
    }
    
    if (supabasePosts && supabasePosts.length > 0) {
      return supabasePosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content || "",
        image: post.image_url || "",
        category: post.blog_categories ? post.blog_categories.name : "General",
        category_id: post.category_id,
        published: post.published,
        author: post.author || "",
        date: post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString(),
        readTime: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
        featured: post.featured || false,
        createdAt: post.created_at,
        updatedAt: post.updated_at
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
export const getBlogPostById = async (id: number | string): Promise<BlogPost | null> => {
  try {
    // Try to get from Supabase first
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories(name, slug)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error retrieving blog post with ID ${id} from Supabase:`, error);
      // Fall back to localStorage
      const posts = await getBlogPosts();
      return posts.find(post => post.id === id) || null;
    }
    
    if (post) {
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content || "",
        image: post.image_url || "",
        category: post.blog_categories ? post.blog_categories.name : "General",
        category_id: post.category_id,
        published: post.published,
        author: post.author || "",
        date: post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString(),
        readTime: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
        featured: post.featured || false,
        createdAt: post.created_at,
        updatedAt: post.updated_at
      };
    }
    
    // Fall back to localStorage if no post found in Supabase
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
    // Try to get from Supabase first
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories(name, slug)
      `)
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`Error retrieving blog post with slug ${slug} from Supabase:`, error);
      // Fall back to localStorage
      const posts = await getBlogPosts();
      return posts.find(post => post.slug === slug) || null;
    }
    
    if (post) {
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content || "",
        image: post.image_url || "",
        category: post.blog_categories ? post.blog_categories.name : "General",
        category_id: post.category_id,
        published: post.published,
        author: post.author || "",
        date: post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString(),
        readTime: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
        featured: post.featured || false,
        createdAt: post.created_at,
        updatedAt: post.updated_at
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
    const { data: scheduledPosts, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories(name, slug)
      `)
      .eq('published', false)
      .not('scheduled_for', 'is', null)
      .lt('scheduled_for', new Date().toISOString());
    
    if (error) {
      console.error("Error retrieving scheduled blog posts from Supabase:", error);
      // Fall back to localStorage
      const posts = await getBlogPosts();
      const now = new Date().toISOString();
      
      return posts.filter(post => 
        !post.published && 
        post.scheduledDate && 
        post.scheduledDate <= now
      );
    }
    
    if (scheduledPosts && scheduledPosts.length > 0) {
      return scheduledPosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content || "",
        image: post.image_url || "",
        category: post.blog_categories ? post.blog_categories.name : "General",
        category_id: post.category_id,
        published: post.published,
        author: post.author || "",
        date: post.created_at ? new Date(post.created_at).toLocaleDateString() : "",
        readTime: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
        featured: post.featured || false,
        scheduledDate: post.scheduled_for,
        createdAt: post.created_at,
        updatedAt: post.updated_at
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
    
    return categories;
  } catch (error) {
    console.error("Error retrieving blog categories:", error);
    return [];
  }
};
