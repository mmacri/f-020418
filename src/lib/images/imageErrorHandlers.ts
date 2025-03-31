
import { imageUrls } from '@/lib/constants';
import { localStorageKeys } from '@/lib/constants';

/**
 * Handles image loading errors by replacing the source with a fallback
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string
): void => {
  const target = event.currentTarget;
  
  // Check if we should use local fallback images
  const useLocalFallback = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
  
  // Get appropriate fallback based on settings
  let fallback = fallbackSrc;
  if (useLocalFallback) {
    // Use local fallback if enabled
    if (fallbackSrc === imageUrls.PRODUCT_DEFAULT) {
      fallback = '/placeholder-product.svg';
    } else if (fallbackSrc === imageUrls.CATEGORY_DEFAULT) {
      fallback = '/placeholder-category.svg';
    } else if (fallbackSrc === imageUrls.BLOG_DEFAULT) {
      fallback = '/placeholder-blog.svg';
    } else if (fallbackSrc === imageUrls.HERO_DEFAULT) {
      fallback = '/placeholder-hero.svg';
    } else {
      fallback = '/placeholder.svg';
    }
  }
  
  // Prevent infinite loop of error events
  if (target.src !== fallback) {
    console.log(`Image failed to load: ${target.src}. Using fallback: ${fallback}`);
    target.src = fallback;
  }
};

/**
 * Logs image errors for debugging and analytics
 */
export const logImageError = (
  imageUrl: string,
  errorType: 'load' | 'decode' | 'timeout' | 'unknown' = 'unknown'
): void => {
  console.error(`Image error (${errorType}): ${imageUrl}`);
  
  // Could implement more advanced error logging here
  // e.g., sending to an analytics service
};

/**
 * Generates a placeholder background with a random color
 */
export const generatePlaceholderBackground = (seed?: string): string => {
  // Generate a deterministic color based on the seed if provided
  if (seed) {
    // Simple hash function to generate a number from a string
    const hashCode = seed.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    
    // Use the hash to generate HSL color values
    const hue = Math.abs(hashCode) % 360;
    return `hsl(${hue}, 70%, 80%)`;
  }
  
  // Random pastel color if no seed is provided
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

/**
 * Applies object-fit and object-position to ensure the image fits correctly
 */
export const applyImageFit = (
  element: HTMLImageElement, 
  fit: 'cover' | 'contain' | 'fill' = 'cover',
  position: string = 'center'
): void => {
  element.style.objectFit = fit;
  element.style.objectPosition = position;
};

/**
 * Preloads an image to ensure it's cached
 */
export const preloadImage = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
};
