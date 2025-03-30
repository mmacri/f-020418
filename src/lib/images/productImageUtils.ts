
import { parseImageUrl } from './imageUtils';
import { imageUrls } from '@/lib/constants';

/**
 * Get a properly formatted product image URL
 */
export const getProductImageUrl = (product: any, index: number = 0): string => {
  // Check if product has images array
  if (product?.images && Array.isArray(product.images) && product.images.length > index) {
    return parseImageUrl(product.images[index]) || imageUrls.PRODUCT_DEFAULT;
  }
  
  // Check for legacy imageUrl field
  if (index === 0 && product?.imageUrl) {
    return parseImageUrl(product.imageUrl) || imageUrls.PRODUCT_DEFAULT;
  }
  
  // Check for additionalImages for legacy support
  if (index > 0 && product?.additionalImages && Array.isArray(product.additionalImages)) {
    const additionalIndex = index - 1;
    if (additionalIndex < product.additionalImages.length) {
      return parseImageUrl(product.additionalImages[additionalIndex]) || imageUrls.PRODUCT_DEFAULT;
    }
  }
  
  // Return default product image
  return imageUrls.PRODUCT_DEFAULT;
};

/**
 * Safely get multiple product images with fallbacks
 */
export const getProductImages = (product: any): string[] => {
  if (!product) return [imageUrls.PRODUCT_DEFAULT];
  
  const images: string[] = [];
  
  // First add main image
  if (product.imageUrl) {
    images.push(parseImageUrl(product.imageUrl) || imageUrls.PRODUCT_DEFAULT);
  }
  
  // Then add additional images if available
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img: string) => {
      const parsedImg = parseImageUrl(img);
      if (parsedImg && !images.includes(parsedImg)) {
        images.push(parsedImg);
      }
    });
  } else if (product.additionalImages && Array.isArray(product.additionalImages)) {
    product.additionalImages.forEach((img: string) => {
      const parsedImg = parseImageUrl(img);
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
};
