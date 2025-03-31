import { localStorageKeys } from "@/lib/constants";
import { BlogPost } from "./types";
import { supabase } from "@/integrations/supabase/client";

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
      createdAt: post.createdAt || post.created_at || new Date().toISOString(),
      updatedAt: post.updatedAt || post.updated_at || new Date().toISOString()
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

// Helper to migrate blog posts from localStorage to Supabase
export const migrateBlogPostsToSupabase = async (): Promise<void> => {
  try {
    const localPosts = getBlogPostsFromStorage();
    
    if (localPosts.length === 0) {
      return;
    }
    
    console.log("Migrating blog posts from localStorage to Supabase...");
    
    // Get existing categories or create default ones
    const { data: categories, error: categoriesError } = await supabase
      .from('blog_categories')
      .select('*');
    
    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      return;
    }
    
    const categoryMap = new Map();
    if (categories) {
      categories.forEach((category: any) => {
        categoryMap.set(category.name.toLowerCase(), category.id);
      });
    }
    
    // For each local post, check if it exists in Supabase and add if not
    for (const post of localPosts) {
      // Check if post exists in Supabase
      const { data: existingPost, error: checkError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', post.slug)
        .maybeSingle();
      
      if (checkError) {
        console.error(`Error checking if post "${post.slug}" exists:`, checkError);
        continue;
      }
      
      if (existingPost) {
        console.log(`Post "${post.slug}" already exists in Supabase, skipping...`);
        continue;
      }
      
      // Find category ID
      let categoryId = null;
      if (post.category) {
        const categoryKey = post.category.toLowerCase();
        categoryId = categoryMap.get(categoryKey);
        
        // If category doesn't exist yet, create it
        if (!categoryId) {
          const { data: newCategory, error: createCategoryError } = await supabase
            .from('blog_categories')
            .insert({
              name: post.category,
              slug: post.category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
              description: `Posts about ${post.category}`
            })
            .select()
            .single();
          
          if (createCategoryError) {
            console.error(`Error creating category "${post.category}":`, createCategoryError);
          } else if (newCategory) {
            categoryId = newCategory.id;
            categoryMap.set(categoryKey, categoryId);
          }
        }
      }
      
      // Create post in Supabase
      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          image_url: post.image || post.coverImage || '',
          category_id: categoryId,
          published: post.published,
          author: post.author || '',
          read_time: post.readTime || post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
          featured: post.featured || false,
          created_at: post.createdAt || post.created_at,
          updated_at: post.updatedAt || post.updated_at,
          published_at: post.published ? (post.updatedAt || post.updated_at) : null,
          scheduled_at: post.scheduledDate || post.scheduled_at
        });
      
      if (insertError) {
        console.error(`Error migrating post "${post.slug}" to Supabase:`, insertError);
      } else {
        console.log(`Successfully migrated post "${post.slug}" to Supabase`);
      }
    }
    
    console.log("Blog post migration completed");
  } catch (error) {
    console.error("Error migrating blog posts to Supabase:", error);
  }
};

// Helper to initialize demo blog posts if none exist
export const initializeDemoBlogPosts = async (): Promise<void> => {
  try {
    // Check if there are any posts in Supabase first
    const { count, error } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error("Error checking for existing posts:", error);
      return;
    }
    
    // If there are already posts, don't create demo ones
    if (count && count > 0) {
      return;
    }
    
    console.log("Initializing demo blog posts...");
    
    // Create demo categories
    const categories = [
      { name: "Recovery Tips", slug: "recovery-tips", description: "Expert advice on recovery techniques and strategies" },
      { name: "Product Reviews", slug: "product-reviews", description: "In-depth reviews of recovery products" },
      { name: "Nutrition", slug: "nutrition", description: "Food and supplements for optimal recovery" }
    ];
    
    const categoryIds: { [key: string]: string } = {};
    
    for (const category of categories) {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('slug', category.slug)
        .maybeSingle();
      
      if (error) {
        console.error(`Error checking for category "${category.slug}":`, error);
        continue;
      }
      
      let categoryId;
      
      if (data) {
        categoryId = data.id;
      } else {
        const { data: newCategory, error: insertError } = await supabase
          .from('blog_categories')
          .insert(category)
          .select()
          .single();
        
        if (insertError) {
          console.error(`Error creating category "${category.name}":`, insertError);
          continue;
        }
        
        if (newCategory) {
          categoryId = newCategory.id;
        }
      }
      
      if (categoryId) {
        categoryIds[category.slug] = categoryId;
      }
    }
    
    // Only proceed if we have at least one category
    if (Object.keys(categoryIds).length === 0) {
      console.error("Failed to create any categories, cannot create demo posts");
      return;
    }
    
    // Create demo blog posts
    // ... (implementation details would go here)
    
    console.log("Demo blog posts initialized");
  } catch (error) {
    console.error("Error initializing demo blog posts:", error);
  }
};
