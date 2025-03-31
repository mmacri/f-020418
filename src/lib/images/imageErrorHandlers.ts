
import { imageUrls } from '@/lib/constants';

/**
 * Handles image loading errors by replacing the failed image with a fallback
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc = imageUrls.PLACEHOLDER
) => {
  const img = event.currentTarget;
  console.log(`Image failed to load: ${img.src}. Using fallback: ${fallbackSrc}`);
  img.src = fallbackSrc;
  img.onerror = null; // Prevent infinite error loop if fallback also fails
};

/**
 * Logs image errors to console for debugging
 */
export const logImageError = (imageSrc: string, error?: any) => {
  console.warn(`Image error for ${imageSrc}:`, error || 'Unknown error');
};

/**
 * Generates a CSS background color based on a string (for placeholders)
 */
export const generatePlaceholderBackground = (text: string): string => {
  // Generate a deterministic color based on the text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to hexadecimal and ensure it's light enough to work as a background
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 85%)`;
};
