
// Re-export everything from the new location for backward compatibility
// Re-export specific items from imageUtils to avoid ambiguity
export { 
  parseImageUrl,
  validateImageDimensions,
  validateImageSize
} from './imageUtils';

// Export from imageErrorHandlers
export { 
  handleImageError,
  logImageError,
  generatePlaceholderBackground
} from './imageErrorHandlers';

// Re-export product image utilities
export { 
  getProductImageUrl,
  getProductImages,
  createProductImageUrl,
  extractImageUrl
} from './productImageUtils';

// Explicitly re-export ImageWithFallback
export { ImageWithFallback } from './ImageWithFallback';
