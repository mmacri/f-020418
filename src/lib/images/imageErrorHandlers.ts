
import { imageUrls } from '@/lib/constants';

/**
 * Handle image loading errors with custom fallback logic
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc?: string
) => {
  const target = e.currentTarget;
  
  // Prevent infinite loops by checking if we've already applied a fallback
  if (target.dataset.fallbackApplied === 'true') {
    return;
  }
  
  // Set fallback image source
  target.src = fallbackSrc || imageUrls.PLACEHOLDER;
  
  // Mark that we've applied a fallback
  target.dataset.fallbackApplied = 'true';
  
  // Apply appropriate styling
  target.classList.add('fallback-image');
};

/**
 * Get a fallback image URL based on content type
 */
export const getFallbackImage = (type: 'product' | 'category' | 'blog' | 'avatar' = 'product') => {
  switch (type) {
    case 'product':
      return imageUrls.PRODUCT_DEFAULT;
    case 'category':
      return imageUrls.CATEGORY_DEFAULT;
    case 'blog':
      return imageUrls.BLOG_DEFAULT;
    case 'avatar':
      return imageUrls.AVATAR_DEFAULT;
    default:
      return imageUrls.PLACEHOLDER;
  }
};
