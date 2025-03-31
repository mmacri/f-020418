
// Re-export everything from the new location for backward compatibility
// This file can be removed after updating all imports
export * from './images';
export { 
  getProductImageUrl,
  getProductImages,
  createProductImageUrl 
} from './images/productImageUtils';
export { extractImageUrl } from '@/services/products/mappers';
