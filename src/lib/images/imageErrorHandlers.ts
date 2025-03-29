
import React from 'react';
import { imageUrls, localStorageKeys } from '../constants';

/**
 * Helper function to handle image loading errors with local storage fallback options
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  type: 'product' | 'category' | 'hero' | 'blog' = 'product'
): void => {
  const imageElement = event.currentTarget;
  
  // Check if we should use local fallbacks
  const useLocalFallback = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
  
  // Get the appropriate fallback image based on type
  const getFallbackImage = () => {
    if (useLocalFallback) {
      return '/placeholder.svg'; // Local path
    }
    
    switch (type) {
      case 'product':
        return imageUrls.PRODUCT_DEFAULT;
      case 'category':
        return imageUrls.CATEGORY_DEFAULT;
      case 'hero':
        return imageUrls.HERO_DEFAULT;
      case 'blog':
        return imageUrls.BLOG_DEFAULT;
      default:
        return imageUrls.DEFAULT_FALLBACK;
    }
  };
  
  const fallbackImage = getFallbackImage();
  
  // Set the fallback image
  imageElement.src = fallbackImage;
  
  // Log the error
  console.log(`Image error handled for type: ${type}, using fallback: ${fallbackImage}`);
};
