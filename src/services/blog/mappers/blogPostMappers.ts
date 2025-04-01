
import { BlogPost, SupabaseBlogPostRow } from "../types";

/**
 * Maps a Supabase blog post row to the BlogPost interface
 */
export const mapSupabaseBlogPostToBlogPost = (post: SupabaseBlogPostRow | any, categoryName: string = "General"): BlogPost => {
  // Check if post is a full SupabaseBlogPostRow or just a partial object
  const isPartialPost = !('read_time' in post) || !('featured' in post) || !('seo_title' in post);
  
  // If it's a partial post, treat it as legacy data
  if (isPartialPost) {
    // Fill in missing properties with defaults
    const completePost: SupabaseBlogPostRow = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content || "",
      excerpt: post.excerpt || "",
      image_url: post.image_url || "",
      author_id: post.author_id || "",
      category_id: post.category_id || "",
      published: post.published || false,
      published_at: post.published_at || null,
      scheduled_at: post.scheduled_at || null,
      created_at: post.created_at || new Date().toISOString(),
      updated_at: post.updated_at || new Date().toISOString(),
      read_time: post.read_time || `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
      featured: post.featured || false,
      seo_title: post.seo_title || post.title || "",
      seo_description: post.seo_description || post.excerpt || "",
      seo_keywords: post.seo_keywords || []
    };
    
    // Use the complete post
    post = completePost;
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
    author: post.author_id || "",
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
    published_at: post.published_at,
    seoTitle: post.seo_title,
    seoDescription: post.seo_description,
    seoKeywords: post.seo_keywords
  };
};
