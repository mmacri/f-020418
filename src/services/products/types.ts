
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price?: number;
  salePrice?: number;
  rating?: number;
  imageUrl?: string;
  imageUrls?: string[];
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
  affiliateUrl?: string;
  asin?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
