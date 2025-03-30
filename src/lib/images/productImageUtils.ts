
import { parseImageUrl } from './imageUtils';
import { imageUrls } from '@/lib/constants';

/**
 * Extract string URL from possibly complex image object
 */
export const extractImageUrl = (imageObj: string | { url: string } | undefined): string => {
  if (!imageObj) return imageUrls.PRODUCT_DEFAULT;
  
  if (typeof imageObj === 'string') {
    return imageObj;
  }
  
  if (typeof imageObj === 'object' && 'url' in imageObj) {
    return imageObj.url;
  }
  
  return imageUrls.PRODUCT_DEFAULT;
};

/**
 * Get a properly formatted product image URL with enhanced error handling
 */
export const getProductImageUrl = (product: any, index: number = 0): string => {
  if (!product) return imageUrls.PRODUCT_DEFAULT;

  try {
    // Check if product has images array
    if (product?.images && Array.isArray(product.images) && product.images.length > index) {
      const imageObj = product.images[index];
      const imageUrl = parseImageUrl(extractImageUrl(imageObj));
      return imageUrl || imageUrls.PRODUCT_DEFAULT;
    }
    
    // Check for legacy imageUrl field
    if (index === 0 && product?.imageUrl) {
      const imageUrl = parseImageUrl(product.imageUrl);
      return imageUrl || imageUrls.PRODUCT_DEFAULT;
    }
    
    // Check for additionalImages for legacy support
    if (index > 0 && product?.additionalImages && Array.isArray(product.additionalImages)) {
      const additionalIndex = index - 1;
      if (additionalIndex < product.additionalImages.length) {
        const imageObj = product.additionalImages[additionalIndex];
        const imageUrl = parseImageUrl(extractImageUrl(imageObj));
        return imageUrl || imageUrls.PRODUCT_DEFAULT;
      }
    }
  } catch (error) {
    console.error('Error getting product image URL:', error);
  }
  
  // Return default product image
  return imageUrls.PRODUCT_DEFAULT;
};

/**
 * Safely get multiple product images with fallbacks and enhanced error handling
 */
export const getProductImages = (product: any): string[] => {
  if (!product) return [imageUrls.PRODUCT_DEFAULT];
  
  try {
    const images: string[] = [];
    
    // First add main image
    if (product.imageUrl) {
      const mainImage = parseImageUrl(product.imageUrl);
      if (mainImage) images.push(mainImage);
    }
    
    // Then add images from the images array if available
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img: string | { url: string }) => {
        const imgUrl = extractImageUrl(img);
        const parsedImg = parseImageUrl(imgUrl);
        if (parsedImg && !images.includes(parsedImg)) {
          images.push(parsedImg);
        }
      });
    } 
    // Fall back to additionalImages for legacy support
    else if (product.additionalImages && Array.isArray(product.additionalImages)) {
      product.additionalImages.forEach((img: string | { url: string }) => {
        const imgUrl = extractImageUrl(img);
        const parsedImg = parseImageUrl(imgUrl);
        if (parsedImg && !images.includes(parsedImg)) {
          images.push(parsedImg);
        }
      });
    }
    
    // If no images were found, use default
    if (images.length === 0) {
      images.push(imageUrls.PRODUCT_DEFAULT);
    }
    
    return images;
  } catch (error) {
    console.error('Error getting product images:', error);
    return [imageUrls.PRODUCT_DEFAULT];
  }
};

/**
 * Create an image URL for a product with cache busting if needed
 */
export const createProductImageUrl = (url: string, useCacheBusting: boolean = false): string => {
  if (!url) return imageUrls.PRODUCT_DEFAULT;
  
  try {
    // Don't add cache busting for local or data URLs
    if (!useCacheBusting || url.startsWith('/') || url.startsWith('data:')) {
      return url;
    }
    
    // Add timestamp as cache buster
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  } catch (error) {
    console.error('Error creating product image URL:', error);
    return imageUrls.PRODUCT_DEFAULT;
  }
};
