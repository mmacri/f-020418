
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  coverImage?: string;
  category: string;
  categoryId?: number;
  tags?: string[];
  author?: string;
  date: string;
  readTime?: string;
  published: boolean;
  scheduledDate?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export type BlogPostInput = Partial<Omit<BlogPost, "id">> & {
  // Required fields
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  
  // Optional fields with defaults
  category?: string;
  image?: string;
  date?: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  scheduledDate?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
};
