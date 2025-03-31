
// Re-export everything from the new location for backward compatibility
export * from './imageUtils';
export * from './imageErrorHandlers';
export { 
  getProductImageUrl,
  getProductImages,
  createProductImageUrl,
  extractImageUrl
} from './productImageUtils';
export { ImageWithFallback } from './ImageWithFallback';
