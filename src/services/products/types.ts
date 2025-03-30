
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  images?: any[];
  inStock?: boolean;
  categoryId?: string;
  category?: string;
  subcategory?: string;
  specifications?: Record<string, any>;
  features?: string[];
  pros?: string[];
  cons?: string[];
  bestSeller?: boolean;
  affiliateUrl?: string;
  asin?: string;
  brand?: string;
  title?: string; // For compatibility with components that use title
  
  // Add fields needed for compatibility with various components
  additionalImages?: any[]; // Legacy field for compatibility
  affiliateLink?: string; // Alias for affiliateUrl for backward compatibility
  comparePrice?: number; // Alias for originalPrice for backward compatibility
  createdAt?: string; // For component compatibility
  updatedAt?: string; // For component compatibility
}

// Define the shape of product data as it comes from Supabase
export interface SupabaseProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price?: number;
  sale_price?: number;
  rating?: number;
  review_count?: number;
  image_url?: string;
  images?: any[];
  in_stock?: boolean;
  category_id?: string;
  subcategory_slug?: string;
  specifications?: any;
  features?: string[];
  pros?: string[];
  cons?: string[];
  best_seller?: boolean;
  affiliate_url?: string;
  asin?: string;
  brand?: string;
  attributes?: any;
  availability?: boolean;
  created_at?: string;
  updated_at?: string;
  original_price?: number;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number | string;
  originalPrice?: number | string;
  rating: number | string;
  reviewCount: number | string;
  imageUrl: string;
  images: string[];
  inStock: boolean;
  categoryId: string;
  subcategory: string;
  specifications: Record<string, any>;
  features: string[];
  pros: string[];
  cons: string[];
  bestSeller: boolean;
  affiliateUrl: string;
  asin: string;
  brand: string;
}

export interface ProductFilterOptions {
  category?: string;
  subcategory?: string;
  priceRange?: [number, number];
  ratings?: number[];
  brands?: string[];
  inStock?: boolean;
  bestSeller?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';
}
