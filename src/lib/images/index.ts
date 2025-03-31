
// Re-export everything from the new location for backward compatibility
export * from './imageUtils';
export * from './imageErrorHandlers';
export { 
  getProductImageUrl,
  getProductImages,
  createProductImageUrl,
  extractImageUrl
} from './productImageUtils';
// Explicitly re-export ImageWithFallback to avoid ambiguity
export { ImageWithFallback } from './ImageWithFallback';

// Explicitly handle the ambiguity by only exporting one version of handleImageError
// We'll use the one from imageErrorHandlers.ts as it seems to be the primary implementation
// export { handleImageError } from './imageErrorHandlers';
