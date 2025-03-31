
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
    categories.forEach((category: any) => {
      categoryMap.set(category.name.toLowerCase(), category.id);
    });
    
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
          } else {
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
          read_time: post.readTime || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
          featured: false,
          created_at: post.createdAt,
          updated_at: post.updatedAt,
          published_at: post.published ? post.updatedAt : null,
          scheduled_for: post.scheduledDate
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
    const { data: existingPosts, error: existingPostsError } = await supabase
      .from('blog_posts')
      .select('id')
      .limit(1);
    
    if (existingPostsError) {
      console.error("Error checking for existing posts:", existingPostsError);
      // Fall back to localStorage
      const localPosts = getBlogPostsFromStorage();
      
      if (localPosts.length === 0) {
        // Add a demo post to localStorage
        const demoPost: BlogPost = {
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
        };
        
        saveBlogPostsToStorage([demoPost]);
      }
      
      return;
    }
    
    // If there are no posts in Supabase
    if (!existingPosts || existingPosts.length === 0) {
      // Check for posts in localStorage that we can migrate
      const localPosts = getBlogPostsFromStorage();
      
      if (localPosts.length > 0) {
        // Migrate existing localStorage posts to Supabase
        await migrateBlogPostsToSupabase();
      } else {
        // Create a demo post in Supabase
        // Get the general category ID or create it
        let generalCategoryId;
        const { data: generalCategory, error: categoryError } = await supabase
          .from('blog_categories')
          .select('id')
          .eq('slug', 'techniques')
          .maybeSingle();
        
        if (categoryError || !generalCategory) {
          // Create the category
          const { data: newCategory, error: newCategoryError } = await supabase
            .from('blog_categories')
            .insert({
              name: 'Techniques',
              slug: 'techniques',
              description: 'Recovery techniques and methods'
            })
            .select()
            .single();
            
          if (newCategoryError) {
            console.error("Error creating Techniques category:", newCategoryError);
          } else {
            generalCategoryId = newCategory.id;
          }
        } else {
          generalCategoryId = generalCategory.id;
        }
        
        // Create the demo post
        const { error: demoPostError } = await supabase
          .from('blog_posts')
          .insert({
            title: "The Ultimate Guide to Foam Rolling for Recovery",
            slug: "foam-rolling-guide",
            excerpt: "Learn how to effectively use foam rollers to enhance muscle recovery, improve mobility, and prevent injuries.",
            content: "<p>Foam rolling has become a popular recovery technique among athletes and fitness enthusiasts. This self-myofascial release technique helps to reduce muscle tension and improve mobility.</p><h2>Benefits of Foam Rolling</h2><p>Regular foam rolling can help with:</p><ul><li>Reducing muscle soreness</li><li>Improving range of motion</li><li>Preventing injury</li><li>Enhancing recovery between workouts</li></ul><p>To get the most out of foam rolling, focus on rolling slowly and pausing on tender areas for 20-30 seconds.</p>",
            category_id: generalCategoryId,
            image_url: "https://ext.same-assets.com/1001010124/foam-roller-guide.jpg",
            published: true,
            author: "Recovery Expert",
            read_time: "5 min read",
            created_at: "2023-07-08T00:00:00Z",
            updated_at: "2023-07-08T00:00:00Z",
            published_at: "2023-07-08T00:00:00Z"
          });
        
        if (demoPostError) {
          console.error("Error creating demo blog post:", demoPostError);
        }
      }
    }
  } catch (error) {
    console.error("Error initializing demo blog posts:", error);
  }
};

// Call the initialization function
initializeDemoBlogPosts();
