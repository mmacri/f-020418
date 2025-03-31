
// Re-export everything from the new location for backward compatibility
// This file can be removed after updating all imports
export * from './images';
export { 
  getProductImageUrl,
  getProductImages,
  createProductImageUrl,
  extractImageUrl
} from './images/productImageUtils';
