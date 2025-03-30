
import { Json } from '@/integrations/supabase/types';

export interface SupabaseProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number | null;
  sale_price: number | null;
  rating: number | null;
  image_url: string | null;
  in_stock: boolean | null;
  availability: boolean | null;
  category_id: string | null;
  attributes: Json | null;
  specifications: Json | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number | string;
  slug: string;
  title?: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  comparePrice?: number; // Added for ProductForm
  rating: number;
  reviewCount: number;
  features?: string[];
  imageUrl: string;
  images?: string[];
  additionalImages?: string[];
  inStock: boolean;
  category: string;
  categoryId?: string | number;
  subcategory?: string;
  subcategoryId?: string | number;
  specifications?: Record<string, string>;
  specs?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
  bestSeller?: boolean;
  comparisonStats?: Record<string, any>;
  affiliateUrl?: string;
  affiliateLink?: string;
  asin?: string;
  brand?: string;
  pros?: string[];
}
