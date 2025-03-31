
import { 
  getProductImageUrl,
  getProductImages,
  createProductImageUrl,
  extractImageUrl
} from './images/productImageUtils';
import { handleImageError } from './images/imageErrorHandlers';
import { ImageWithFallback } from './images/ImageWithFallback';

// Re-export the ImageWithFallback component
export { ImageWithFallback };

// Re-export utility functions
export { 
  getProductImageUrl,
  getProductImages,
  createProductImageUrl,
  extractImageUrl,
  handleImageError
};
