
import { BlogPost, SupabaseBlogPostRow } from "../types";

/**
 * Maps a Supabase blog post row to the BlogPost interface
 */
export const mapSupabaseBlogPostToBlogPost = (post: SupabaseBlogPostRow, categoryName: string = "General"): BlogPost => {
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
