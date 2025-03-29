
import React, { useState, useEffect } from 'react';

// Constants
const DEFAULT_FALLBACK_IMAGE = '/placeholder.svg';
const REMOTE_FALLBACK_IMAGE = 'https://placehold.co/600x400?text=Image+Not+Found';

export interface ImageFallbackOptions {
  defaultImage?: string;
  localFallbackImage?: string;
  useRemoteFallback?: boolean;
}

/**
 * Add cache busting to image URLs to prevent browser caching
 */
export const addCacheBusting = (url: string): string => {
  if (!url) return DEFAULT_FALLBACK_IMAGE;
  
  // Don't add cache busting to placeholder images, data URLs, or blob URLs
  if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // Add timestamp as cache buster
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

/**
 * Test if an image URL is valid
 */
export const testImageUrl = async (url: string): Promise<boolean> => {
  if (!url) return false;
  
  // Local paths are assumed valid
  if (url.startsWith('/')) return true;
  
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return true; // If no error is thrown, assume it's valid (due to CORS limitations)
  } catch (error) {
    console.warn('Image URL test failed:', url, error);
    return false;
  }
};

/**
 * Custom hook for handling image fallbacks
 */
export const useImageWithFallback = (initialSrc: string, options: ImageFallbackOptions = {}) => {
  const { 
    defaultImage = '', 
    localFallbackImage = DEFAULT_FALLBACK_IMAGE,
    useRemoteFallback = true
  } = options;
  
  const [imageUrl, setImageUrl] = useState<string>(initialSrc || '');
  const [fallbackTriggered, setFallbackTriggered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // If initialSrc changes, reset the state
  useEffect(() => {
    if (initialSrc !== imageUrl && !fallbackTriggered) {
      setImageUrl(initialSrc);
      setIsLoading(true);
    }
  }, [initialSrc]);

  const handleImageError = () => {
    console.log('Image error triggered for:', imageUrl);
    
    if (fallbackTriggered) {
      // If we've already tried a fallback, don't try again
      return;
    }
    
    if (defaultImage && imageUrl !== defaultImage) {
      // First try the defaultImage if provided
      console.log('Using default image fallback:', defaultImage);
      setImageUrl(defaultImage);
    } else if (useRemoteFallback && !imageUrl.startsWith('/')) {
      // Try remote fallback for non-local images
      console.log('Using remote fallback image');
      setImageUrl(REMOTE_FALLBACK_IMAGE);
    } else {
      // Fallback to local image as last resort
      console.log('Using local fallback image:', localFallbackImage);
      setImageUrl(localFallbackImage);
    }
    
    setFallbackTriggered(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageUrl);
    setIsLoading(false);
  };

  return { 
    imageUrl, 
    handleImageError, 
    handleImageLoad,
    fallbackTriggered, 
    isLoading,
    setImageUrl
  };
};

/**
 * Generate the correct image URL based on type and modifiers
 */
export const getImageUrl = (
  url: string, 
  type: 'product' | 'category' | 'blog' | 'avatar' | 'general' = 'general',
  size: 'small' | 'medium' | 'large' | 'original' = 'medium'
): string => {
  // Handle already fully formed URLs
  if (url && (url.startsWith('http') || url.startsWith('/'))) {
    return url;
  }
  
  // Handle empty URLs
  if (!url) {
    return DEFAULT_FALLBACK_IMAGE;
  }
  
  // Construct URL based on type and size
  switch (type) {
    case 'product':
      return `/assets/products/${size}/${url}`;
    case 'category':
      return `/assets/categories/${url}`;
    case 'blog':
      return `/assets/blog/${url}`;
    case 'avatar':
      return `/assets/avatars/${url}`;
    default:
      return `/assets/images/${url}`;
  }
};

/**
 * Image component with fallback capability
 */
export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  type?: 'product' | 'category' | 'blog' | 'avatar' | 'general';
  size?: 'small' | 'medium' | 'large' | 'original';
  onLoad?: () => void;
  disableCacheBusting?: boolean;
}

export const ImageWithFallback = React.forwardRef<HTMLImageElement, ImageWithFallbackProps>(
  ({ 
    src, 
    alt, 
    fallbackSrc = DEFAULT_FALLBACK_IMAGE, 
    type = 'general',
    size = 'medium',
    onLoad,
    disableCacheBusting = false,
    className,
    ...props 
  }, ref) => {
    const processedSrc = src || DEFAULT_FALLBACK_IMAGE;
    const { 
      imageUrl, 
      handleImageError, 
      handleImageLoad,
      isLoading 
    } = useImageWithFallback(processedSrc, {
      defaultImage: '',
      localFallbackImage: fallbackSrc,
      useRemoteFallback: true
    });

    // Process the URL for cache busting if enabled
    const finalSrc = disableCacheBusting ? imageUrl : addCacheBusting(imageUrl);

    return React.createElement('img', {
      src: finalSrc,
      alt,
      onError: handleImageError,
      onLoad: (e) => {
        handleImageLoad();
        if (onLoad) onLoad();
      },
      className: `${className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
      ref,
      ...props
    });
  }
);

ImageWithFallback.displayName = 'ImageWithFallback';

// Helper function to get image URL from a product
export const getProductImageUrl = (product: any): string => {
  if (!product) return DEFAULT_FALLBACK_IMAGE;
  
  // Check for imageUrl property first
  if (product.imageUrl) {
    return product.imageUrl;
  }
  
  // Then check images array
  if (!product.images || product.images.length === 0) {
    return DEFAULT_FALLBACK_IMAGE;
  }
  
  const firstImage = product.images[0];
  
  if (typeof firstImage === 'string') {
    return firstImage;
  } else if (typeof firstImage === 'object' && firstImage !== null) {
    // Safely check for url property without assuming its structure
    return firstImage.url || DEFAULT_FALLBACK_IMAGE;
  }
  
  return DEFAULT_FALLBACK_IMAGE;
};
