
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
