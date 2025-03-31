
// Export all image utilities from a single entry point
export { ImageWithFallback } from './ImageWithFallback';
export { 
  handleImageError, 
  logImageError,
  generatePlaceholderBackground 
} from './imageErrorHandlers';
export { 
  getProductImageUrl,
  getProductImages,
  createProductImageUrl,
  extractImageUrl
} from './productImageUtils';
