
import React, { useState } from 'react';
import { localStorageKeys, imageUrls } from '@/lib/constants';
import { 
  getProductImageUrl,
  getProductImages,
  createProductImageUrl,
  extractImageUrl
} from './images/productImageUtils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  type?: 'product' | 'category' | 'hero' | 'blog';
  disableCacheBusting?: boolean;
  onLoad?: () => void;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  type = 'product',
  disableCacheBusting = true,
  onLoad,
}) => {
  const [error, setError] = useState(false);
  const defaultFallback = type === 'hero' 
    ? imageUrls.HERO_DEFAULT 
    : type === 'category' 
      ? imageUrls.CATEGORY_DEFAULT 
      : imageUrls.PLACEHOLDER;
  
  // Use provided fallback or default based on type
  const fallback = fallbackSrc || defaultFallback;
  
  // Check if we should use local fallback images
  const useLocalFallback = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
  const localFallback = '/placeholder.svg';
  
  // If error occurred, use fallback
  const imageSrc = error 
    ? (useLocalFallback ? localFallback : fallback) 
    : src || fallback;
  
  // Add cache busting parameter if enabled
  const finalSrc = disableCacheBusting 
    ? imageSrc 
    : `${imageSrc}${imageSrc.includes('?') ? '&' : '?'}t=${Date.now()}`;
  
  // Determine object-fit based on type
  const objectFitClass = type === 'hero' 
    ? 'object-cover w-full h-full' 
    : 'object-contain';
  
  const handleError = () => {
    console.log(`Image failed to load: ${src}. Using fallback.`);
    setError(true);
  };
  
  const handleLoad = () => {
    if (onLoad) onLoad();
  };
  
  return (
    <img
      src={finalSrc}
      alt={alt}
      className={`${objectFitClass} ${className}`}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};

// Re-export utility functions
export { 
  getProductImageUrl,
  getProductImages,
  createProductImageUrl,
  extractImageUrl
};
