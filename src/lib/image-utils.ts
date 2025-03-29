
import React from 'react';
import { imageUrls, localStorageKeys } from './constants';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  type?: 'product' | 'category' | 'hero' | 'blog';
  disableCacheBusting?: boolean;
  onLoad?: () => void;
}

// Component to handle image loading with fallback
export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  type = 'product',
  disableCacheBusting = true,
  onLoad,
}) => {
  const getDefaultFallback = () => {
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

  const defaultFallback = getDefaultFallback();
  const finalFallbackSrc = fallbackSrc || defaultFallback;

  // Use a unique key for cache busting if enabled
  const cacheBuster = disableCacheBusting ? '' : `?t=${Date.now()}`;
  const srcWithCacheBuster = src ? `${src}${cacheBuster}` : '';

  const [imgSrc, setImgSrc] = React.useState<string>(srcWithCacheBuster || finalFallbackSrc);
  const [error, setError] = React.useState<boolean>(false);

  // Reset image source if src prop changes
  React.useEffect(() => {
    if (src) {
      setImgSrc(srcWithCacheBuster);
      setError(false);
    }
  }, [src, srcWithCacheBuster]);

  const handleError = () => {
    if (!error) {
      console.log(`Image failed to load: ${src}. Using fallback.`);
      setError(true);
      setImgSrc(finalFallbackSrc);
    }
  };

  const handleLoad = () => {
    if (onLoad) {
      onLoad();
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};

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

/**
 * Parse image URLs from various formats
 */
export const parseImageUrl = (image: any): string => {
  if (!image) return '';
  
  if (typeof image === 'string') {
    return image;
  }
  
  if (typeof image === 'object') {
    // If it's an object, try to find url, src, or other common properties
    return image.url || image.src || image.imageUrl || image.path || '';
  }
  
  return '';
};

/**
 * Get image dimensions from a URL if possible
 */
export const getImageDimensions = async (url: string): Promise<{width: number; height: number}> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({width: img.width, height: img.height});
    };
    img.onerror = () => {
      resolve({width: 0, height: 0});
    };
    img.src = url;
  });
};

/**
 * Check if an image exists and is accessible
 */
export const checkImageExists = async (url: string): Promise<boolean> => {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking image:', error);
    return false;
  }
};

/**
 * Generate a placeholder image URL
 */
export const generatePlaceholderImage = (
  width: number = 800, 
  height: number = 600, 
  text: string = 'Image Placeholder'
): string => {
  // Use a placeholder service
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
};

/**
 * Get a product image URL from different product object formats
 */
export const getProductImageUrl = (product: any): string => {
  if (!product) return '/placeholder.svg';
  
  // Handle different product image structures
  if (product.imageUrl) {
    return product.imageUrl;
  }
  
  if (product.images && product.images.length > 0) {
    const firstImage = product.images[0];
    
    // Handle string image URLs
    if (typeof firstImage === 'string') {
      return firstImage;
    }
    
    // Handle object image structures
    if (typeof firstImage === 'object' && firstImage !== null) {
      return firstImage.url || firstImage.src || firstImage.path || '/placeholder.svg';
    }
  }
  
  // Default fallback
  return '/placeholder.svg';
};
