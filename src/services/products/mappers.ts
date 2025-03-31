import { Product, SupabaseProduct } from './types';

/**
 * Extract image URL from different image formats
 */
export const extractImageUrl = (image: any): string => {
  if (!image) return '';
  
  // If image is a string, return it directly
  if (typeof image === 'string') {
    return image;
  }
  
  // If image is an object with url property
  if (image.url) {
    return image.url;
  }
  
  // If image is an object with src property
  if (image.src) {
    return image.src;
  }
  
  // If image is a legacy format where the object itself is the URL
  if (typeof image === 'object' && Object.keys(image).length === 0) {
    return '/placeholder.svg';
  }
  
  // Return empty string if no format matches
  return '';
};

/**
 * Map a Product object to a SupabaseProduct object
 */
export const mapProductToSupabaseProduct = (product: Partial<Product>): Partial<SupabaseProduct> => {
  if (!product) return {};
  
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    sale_price: product.salePrice,
    rating: product.rating,
    review_count: product.reviewCount,
    image_url: product.imageUrl,
    images: product.images,
    in_stock: product.inStock,
    category_id: product.categoryId,
    subcategory_slug: product.subcategory,
    specifications: product.specifications,
    features: product.features,
    pros: product.pros,
    cons: product.cons,
    best_seller: product.bestSeller,
    affiliate_url: product.affiliateUrl || product.affiliateLink,
    asin: product.asin,
    brand: product.brand,
    attributes: {
      shortDescription: product.shortDescription,
      bestSeller: product.bestSeller,
      comparePrice: product.comparePrice || product.originalPrice
    },
    availability: product.inStock,
    original_price: product.originalPrice || product.comparePrice
  };
};

/**
 * Map a SupabaseProduct object to a Product object
 */
export const mapSupabaseProductToProduct = (supabaseProduct: SupabaseProduct): Product => {
  if (!supabaseProduct) {
    return {} as Product;
  }
  
  // Extract attributes from the attributes JSON object
  const attributes = supabaseProduct.attributes || {};
  
  return {
    id: supabaseProduct.id,
    name: supabaseProduct.name,
    slug: supabaseProduct.slug,
    description: supabaseProduct.description || '',
    shortDescription: attributes.shortDescription,
    price: supabaseProduct.price || 0,
    salePrice: supabaseProduct.sale_price,
    originalPrice: supabaseProduct.original_price,
    rating: supabaseProduct.rating || 4.5,
    reviewCount: supabaseProduct.review_count || 0,
    imageUrl: supabaseProduct.image_url || '',
    images: supabaseProduct.images || [],
    inStock: supabaseProduct.in_stock !== false,
    categoryId: supabaseProduct.category_id,
    subcategory: supabaseProduct.subcategory_slug,
    specifications: supabaseProduct.specifications || {},
    features: supabaseProduct.features || [],
    pros: supabaseProduct.pros || [],
    cons: supabaseProduct.cons || [],
    bestSeller: supabaseProduct.best_seller || attributes.bestSeller || false,
    affiliateUrl: supabaseProduct.affiliate_url || '',
    asin: supabaseProduct.asin || '',
    brand: supabaseProduct.brand || '',
    
    // Aliases for compatibility
    title: supabaseProduct.name,
    affiliateLink: supabaseProduct.affiliate_url,
    comparePrice: supabaseProduct.original_price,
    createdAt: supabaseProduct.created_at,
    updatedAt: supabaseProduct.updated_at
  };
};
