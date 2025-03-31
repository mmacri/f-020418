
import { imageUrls } from '@/lib/constants';

/**
 * Extracts image URL from various possible sources
 */
export const extractImageUrl = (image: any): string => {
  if (!image) return imageUrls.PRODUCT_DEFAULT;
  
  if (typeof image === 'string') return image;
  
  if (typeof image === 'object') {
    if (image.url) return image.url;
    if (image.src) return image.src;
    if (image.imageUrl) return image.imageUrl;
    if (image.path) return image.path;
  }
  
  return imageUrls.PRODUCT_DEFAULT;
};

/**
 * Gets the product image URL or returns a fallback
 */
export const getProductImageUrl = (product: any): string => {
  if (!product) return imageUrls.PLACEHOLDER;
  
  // Try to get image from different possible sources
  if (product.imageUrl) return product.imageUrl;
  if (product.image_url) return product.image_url;
  
  // If product has images array, use the first one
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0];
    // Handle both string and object formats
    if (typeof firstImage === 'string') return firstImage;
    if (typeof firstImage === 'object' && firstImage.url) return firstImage.url;
    if (typeof firstImage === 'object' && firstImage.src) return firstImage.src;
  }
  
  // Return default placeholder if no image is found
  return imageUrls.PRODUCT_DEFAULT;
};

/**
 * Gets an array of product images
 */
export const getProductImages = (product: any): string[] => {
  if (!product) return [imageUrls.PLACEHOLDER];
  
  // If product has images array, process it
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images.map(image => {
      // Handle both string and object formats
      if (typeof image === 'string') return image;
      if (typeof image === 'object' && image.url) return image.url;
      if (typeof image === 'object' && image.src) return image.src;
      return imageUrls.PRODUCT_DEFAULT;
    });
  }
  
  // If no images array, create array with main image
  if (product.imageUrl) return [product.imageUrl];
  if (product.image_url) return [product.image_url];
  
  // Return default placeholder if no image is found
  return [imageUrls.PRODUCT_DEFAULT];
};

/**
 * Creates a product image URL with possible modifications
 */
export const createProductImageUrl = (
  url: string, 
  options: { width?: number; height?: number; quality?: number } = {}
): string => {
  if (!url) return imageUrls.PRODUCT_DEFAULT;
  
  // If it's a local URL or data URL, return as is
  if (url.startsWith('/') || url.startsWith('data:')) {
    return url;
  }
  
  // Handle CDN providers
  try {
    const imageUrl = new URL(url);
    
    // Cloudinary format
    if (imageUrl.hostname.includes('cloudinary.com')) {
      const { width, height, quality } = options;
      const params = [];
      
      if (width) params.push(`w_${width}`);
      if (height) params.push(`h_${height}`);
      if (quality) params.push(`q_${quality}`);
      
      if (params.length > 0) {
        // Insert transformation parameters
        const urlParts = url.split('/upload/');
        if (urlParts.length === 2) {
          return `${urlParts[0]}/upload/${params.join(',')}/v${Date.now()}/${urlParts[1]}`;
        }
      }
    }
    
    // Else, return the original URL
    return url;
    
  } catch (error) {
    // If URL parsing fails, return the URL as is
    return url;
  }
};
