
/**
 * Gets the URL for a product image
 */
export const getProductImageUrl = (productId: string, index = 0): string => {
  return `https://storage.googleapis.com/same-assets/products/${productId}/image-${index}.jpg`;
};

/**
 * Gets all images for a product
 */
export const getProductImages = (productId: string, count = 4): string[] => {
  return Array.from({ length: count }, (_, i) => getProductImageUrl(productId, i));
};

/**
 * Creates a product image URL with proper formatting
 */
export const createProductImageUrl = (productId: string, imageName: string): string => {
  return `https://storage.googleapis.com/same-assets/products/${productId}/${imageName}`;
};

/**
 * Extracts the URL from an image object or string
 */
export const extractImageUrl = (image: any): string => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  if (image.url) return image.url;
  if (image.src) return image.src;
  return '';
};
