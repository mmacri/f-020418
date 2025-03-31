
export interface BlogPost {
  id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  image_url?: string;
  coverImage?: string;
  category?: string;
  category_id?: string;
  categoryId?: string;
  tags?: string[];
  author?: string;
  author_id?: string;
  date?: string;
  readTime?: string;
  read_time?: string;
  published: boolean;
  featured?: boolean;
  scheduledDate?: string;
  scheduled_at?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  published_at?: string;
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
  category_id?: string;
  image?: string;
  image_url?: string;
  date?: string;
  coverImage?: string;
  author?: string;
  author_id?: string;
  tags?: string[];
  scheduledDate?: string;
  scheduled_at?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  featured?: boolean;
  read_time?: string;
};

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface BlogPostTag {
  post_id: string;
  tag_id: string;
}
