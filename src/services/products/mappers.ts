
import { Product, ProductReview, SupabaseProduct } from './types';
import { supabase } from '@/integrations/supabase/client';

// Extract and format image URL from product data
export const extractImageUrl = (product: any): string => {
  // First, try to get the image URL directly
  if (product.imageUrl) {
    return product.imageUrl;
  }
  
  // Then try image_url (from Supabase)
  if (product.image_url) {
    return product.image_url;
  }
  
  // Try to get from images array if available
  if (product.images && product.images.length > 0) {
    // Handle different image formats
    const firstImage = product.images[0];
    if (typeof firstImage === 'string') {
      return firstImage;
    }
    if (typeof firstImage === 'object' && firstImage.url) {
      return firstImage.url;
    }
  }
  
  // Fallback to a default image
  return "https://ext.same-assets.com/30303031/product-image-placeholder.jpg";
};

// Map Supabase product data to our Product interface
export const mapSupabaseProductToProduct = (product: any): Product => {
  // Extract data from attributes JSON if available
  const attributes = product.attributes || {};
  
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    price: product.price || 0,
    salePrice: product.sale_price,
    imageUrl: product.image_url || '',
    rating: product.rating || 0,
    inStock: product.in_stock !== false,
    categoryId: product.category_id,
    specifications: product.specifications || {},
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    
    // Optional fields from attributes
    subcategoryId: attributes.subcategoryId,
    brand: attributes.brand,
    images: attributes.images || [],
    features: attributes.features || [],
    pros: attributes.pros || [],
    cons: attributes.cons || [],
    reviewCount: attributes.reviewCount || 0,
    originalPrice: attributes.originalPrice || product.price,
    bestSeller: attributes.bestSeller === true,
    affiliateUrl: attributes.affiliateUrl,
    asin: attributes.asin,
  };
};

// Map product review from database to frontend type
export const mapSupabaseReviewToReview = (review: any): ProductReview => {
  return {
    id: review.id,
    productId: review.product_id,
    author: review.author_name || 'Anonymous',
    rating: review.rating || 0,
    title: review.title || '',
    content: review.content || '',
    verified: review.verified === true,
    createdAt: review.created_at,
    updatedAt: review.updated_at,
    helpful: review.helpful_count || 0
  };
};

// Map from our Product interface to Supabase format
export const mapProductToSupabaseProduct = (product: Partial<Product>): Partial<SupabaseProduct> => {
  // Extract product attributes that don't directly map to Supabase columns
  const attributes: Record<string, any> = {};
  
  // Map frontend fields to attributes object
  if (product.images) attributes.images = product.images;
  if (product.features) attributes.features = product.features;
  if (product.pros) attributes.pros = product.pros;
  if (product.cons) attributes.cons = product.cons;
  if (product.reviewCount) attributes.reviewCount = product.reviewCount;
  if (product.originalPrice) attributes.originalPrice = product.originalPrice;
  if (product.bestSeller !== undefined) attributes.bestSeller = product.bestSeller;
  if (product.affiliateUrl) attributes.affiliateUrl = product.affiliateUrl;
  if (product.asin) attributes.asin = product.asin;
  if (product.brand) attributes.brand = product.brand;
  
  // Return mapped product data
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    sale_price: product.salePrice,
    image_url: product.imageUrl,
    rating: product.rating,
    in_stock: product.inStock,
    category_id: product.categoryId,
    specifications: product.specifications || {},
    attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
  };
};
