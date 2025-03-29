
import { useState, useEffect } from 'react';
import { localStorageKeys } from './constants';

const DEFAULT_PLACEHOLDER = '/placeholder.svg';
const DEFAULT_RECOVERY_IMAGE = '/recovery-placeholder.jpg';

interface ImageConfig {
  defaultImage?: string;
  localFallbackImage?: string;
  forceFallback?: boolean;
}

/**
 * Adds cache busting to image URLs to prevent stale caches
 */
export const addCacheBusting = (url: string): string => {
  if (!url) return url;
  
  // Don't add cache busting to local images, data URLs, or URLs with existing cache busters
  if (url.startsWith('/') || url.startsWith('data:') || url.includes('t=')) return url;
  
  // Add timestamp as cache buster
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

/**
 * Utility hook for handling images with fallbacks
 */
export const useImageWithFallback = (
  initialUrl: string, 
  config: ImageConfig = {}
) => {
  const {
    defaultImage = DEFAULT_RECOVERY_IMAGE,
    localFallbackImage = DEFAULT_PLACEHOLDER,
    forceFallback = false
  } = config;
  
  const [imageUrl, setImageUrl] = useState<string>(initialUrl || defaultImage);
  const [useLocalFallback, setUseLocalFallback] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if we should use local fallback based on localStorage setting
    const useLocal = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
    setUseLocalFallback(useLocal);
    
    // Reset image if initial URL changes
    if (initialUrl && !forceFallback) {
      setImageUrl(initialUrl);
      setHasError(false);
      setIsLoaded(false);
    } else if (forceFallback) {
      const fallbackImage = useLocal ? localFallbackImage : defaultImage;
      setImageUrl(fallbackImage);
      setHasError(false);
      setIsLoaded(true);
    }
  }, [initialUrl, forceFallback, defaultImage, localFallbackImage]);
  
  const handleImageError = () => {
    setHasError(true);
    const fallbackImage = useLocalFallback ? localFallbackImage : defaultImage;
    setImageUrl(fallbackImage);
    console.log(`Image failed to load. Using fallback image: ${fallbackImage}`);
  };
  
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  
  return {
    imageUrl,
    hasError,
    isLoaded,
    handleImageError,
    handleImageLoad,
    useLocalFallback
  };
};

/**
 * Get appropriate fallback image URL based on settings
 */
export const getFallbackImageUrl = (
  type: 'product' | 'category' | 'blog' | 'hero' | 'general' = 'general'
): string => {
  const useLocalFallback = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
  
  if (useLocalFallback) {
    return DEFAULT_PLACEHOLDER;
  }
  
  switch (type) {
    case 'product':
      return 'https://ext.same-assets.com/1001010126/product-placeholder.jpg';
    case 'category':
      return 'https://ext.same-assets.com/1001010126/category-placeholder.jpg';
    case 'blog':
      return 'https://ext.same-assets.com/1001010126/blog-placeholder.jpg';
    case 'hero':
      return 'https://ext.same-assets.com/1001010126/hero-placeholder.jpg';
    default:
      return DEFAULT_RECOVERY_IMAGE;
  }
};

/**
 * Image component with consistent fallback handling
 */
export const ImageWithFallback: React.FC<{
  src: string;
  alt: string;
  className?: string;
  type?: 'product' | 'category' | 'blog' | 'hero' | 'general';
  width?: string | number;
  height?: string | number;
}> = ({ src, alt, className = '', type = 'general', width, height }) => {
  const { 
    imageUrl, 
    handleImageError, 
    handleImageLoad, 
    isLoaded 
  } = useImageWithFallback(src, {
    defaultImage: getFallbackImageUrl(type)
  });
  
  return (
    <img
      src={imageUrl}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onError={handleImageError}
      onLoad={handleImageLoad}
      width={width}
      height={height}
    />
  );
};
