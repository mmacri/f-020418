
import { z } from 'zod';

export const blogPostSchema = z.object({
  // Basic Information
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required').max(300, 'Excerpt must be less than 300 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  
  // Publication Details
  date: z.string().min(1, 'Publication date is required'),
  category_id: z.string().min(1, 'Category is required'),
  category: z.string().optional(),
  author: z.string().min(1, 'Author is required'),
  scheduledDate: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  
  // Image and Tags
  image: z.string().optional(),
  image_url: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  
  // SEO Details
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional().default([])
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;
