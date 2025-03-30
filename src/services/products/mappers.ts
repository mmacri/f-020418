
import { Product } from './types';

export const mapSupabaseProductToProduct = (product: any): Product => {
  if (!product) {
    console.error('Received null or undefined product in mapSupabaseProductToProduct');
    return {
      id: 'default',
      slug: 'default',
      name: 'Product Not Available',
      description: '',
      price: 0,
      rating: 0,
      reviewCount: 0,
      imageUrl: '',
      inStock: false,
      category: '',
    };
  }
  
  try {
    // Safely parse attributes with explicit typing
    let attributes: Record<string, any> = {};
    if (product.attributes) {
      if (typeof product.attributes === 'string') {
        try {
          attributes = JSON.parse(product.attributes);
        } catch (e) {
          console.error('Error parsing attributes string:', e);
        }
      } else {
        attributes = product.attributes as Record<string, any>;
      }
    }
    
    // Safely parse specifications with explicit typing
    let specifications: Record<string, any> = {};
    if (product.specifications) {
      if (typeof product.specifications === 'string') {
        try {
          specifications = JSON.parse(product.specifications);
        } catch (e) {
          console.error('Error parsing specifications string:', e);
        }
      } else {
        specifications = product.specifications as Record<string, any>;
      }
    }
    
    const productId = product.id ? product.id : 'unknown';
    
    return {
      id: productId,
      slug: product.slug || 'unknown',
      name: product.name || 'Unnamed Product',
      title: product.name || 'Unnamed Product', // Add title for compatibility
      description: product.description || '',
      price: product.price || 0,
      originalPrice: product.original_price || undefined,
      rating: product.rating || 0,
      reviewCount: product.review_count || 0,
      imageUrl: product.image_url || '',
      images: product.images || [],
      additionalImages: product.images || [], // For backward compatibility
      inStock: product.in_stock !== false, // Default to true unless explicitly false
      category: attributes.category || '',
      categoryId: product.category_id,
      subcategory: product.subcategory_slug || '',
      specifications: specifications,
      features: product.features || [],
      pros: product.pros || [],
      cons: product.cons || [],
      bestSeller: product.best_seller || false,
      affiliateUrl: product.affiliate_url || '',
      affiliateLink: product.affiliate_url || '', // For backward compatibility
      asin: product.asin || '',
      brand: product.brand || '',
      comparePrice: product.original_price || undefined // For backward compatibility
    };
  } catch (error) {
    console.error('Error mapping product:', error, product);
    return {
      id: product.id || 'error',
      slug: product.slug || 'error',
      name: product.name || 'Error Mapping Product',
      title: product.name || 'Error Mapping Product',
      description: 'There was an error processing this product data.',
      price: 0,
      rating: 0,
      reviewCount: 0,
      imageUrl: '',
      inStock: false,
      category: '',
    };
  }
};

export const mapProductToSupabaseProduct = (product: Partial<Product>) => {
  // Get the first image url, handling both string and object types
  const getFirstImageUrl = (images?: (string | { url: string })[]): string => {
    if (!images || images.length === 0) return '';
    const firstImage = images[0];
    return typeof firstImage === 'string' ? firstImage : firstImage.url;
  };

  return {
    id: product.id?.toString(),
    slug: product.slug,
    name: product.name,
    description: product.description,
    short_description: product.shortDescription,
    price: product.price,
    original_price: product.originalPrice || product.comparePrice,
    rating: product.rating,
    review_count: product.reviewCount,
    image_url: product.imageUrl || getFirstImageUrl(product.images as any),
    images: product.images,
    in_stock: product.inStock,
    category_id: product.categoryId?.toString(),
    subcategory_slug: product.subcategory,
    specifications: product.specifications || product.specifications,
    features: product.features,
    pros: product.pros,
    cons: product.cons,
    best_seller: product.bestSeller,
    affiliate_url: product.affiliateUrl || product.affiliateLink,
    asin: product.asin,
    brand: product.brand
  };
};

export const extractImageUrl = (image: string | { url: string } | undefined): string => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url;
};
