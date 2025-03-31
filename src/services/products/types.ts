
import { Json } from '@/integrations/supabase/types';

export interface SupabaseProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price?: number;
  sale_price?: number;
  original_price?: number;
  rating?: number;
  review_count?: number;
  image_url?: string;
  images?: any[];
  in_stock?: boolean;
  best_seller?: boolean;
  featured?: boolean;
  is_new?: boolean;
  category?: string;
  category_id?: string;
  subcategory?: string;
  subcategory_slug?: string;
  specifications?: Json;
  attributes?: Json;
  features?: string[];
  pros?: string[];
  cons?: string[];
  affiliate_url?: string;
  asin?: string;
  brand?: string;
  availability?: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  salePrice?: number;
  originalPrice?: number;
  comparePrice?: number;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  imageUrls?: string[];
  images?: any[];
  inStock?: boolean;
  bestSeller?: boolean;
  featured?: boolean;
  isNew?: boolean;
  category?: string;
  categoryId?: string;
  subcategory?: string;
  subcategoryId?: string;
  specifications?: Record<string, any>;
  attributes?: Record<string, any>;
  features?: string[];
  pros?: string[];
  cons?: string[];
  affiliateUrl?: string;
  affiliateLink?: string;
  asin?: string;
  brand?: string;
  title?: string; // Alias for name in some parts of the app
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
