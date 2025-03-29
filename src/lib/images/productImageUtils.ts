
/**
 * Get a product image URL from different product object formats
 */
export const getProductImageUrl = (product: any): string => {
  if (!product) return '/placeholder.svg';
  
  // Handle different product image structures
  if (product.imageUrl) {
    return product.imageUrl;
  }
  
  if (product.images && product.images.length > 0) {
    const firstImage = product.images[0];
    
    // Handle string image URLs
    if (typeof firstImage === 'string') {
      return firstImage;
    }
    
    // Handle object image structures
    if (typeof firstImage === 'object' && firstImage !== null) {
      return firstImage.url || firstImage.src || firstImage.path || '/placeholder.svg';
    }
  }
  
  // Default fallback
  return '/placeholder.svg';
};
