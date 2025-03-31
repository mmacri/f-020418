
// Export all utility functions from various image-related files

// Error handling utilities
export { 
  handleImageError,
  logImageError,
  generatePlaceholderBackground,
  applyImageFit,
  preloadImage
} from './imageErrorHandlers';

// Product image utilities
export { 
  getProductImageUrl,
  getProductImages,
  createProductImageUrl,
  extractImageUrl
} from './productImageUtils';

// Export any remaining image utilities
export { 
  ImageWithFallback
} from './ImageWithFallback';

// Export other utility functions as needed
export * from './imageUtils';
