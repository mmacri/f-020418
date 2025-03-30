
import React, { useState } from 'react';
import { handleImageError } from './imageErrorHandlers';
import { imageUrls } from '@/lib/constants';

export interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  disableCacheBusting?: boolean;
  onLoad?: () => void;
  type?: 'product' | 'category' | 'blog' | 'avatar' | 'subcategory' | 'hero'; // Added hero type
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  width,
  height,
  loading = 'lazy',
  disableCacheBusting = false,
  onLoad,
  type,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  // Determine appropriate fallback based on image type
  const getFallbackSrc = () => {
    if (fallbackSrc) return fallbackSrc;
    
    if (type) {
      switch (type) {
        case 'product':
          return imageUrls.PRODUCT_DEFAULT;
        case 'category':
        case 'subcategory':
          return imageUrls.CATEGORY_DEFAULT;
        case 'blog':
          return imageUrls.BLOG_DEFAULT;
        case 'avatar':
          return imageUrls.AVATAR_DEFAULT;
        case 'hero':
          return imageUrls.HERO_DEFAULT;
        default:
          return imageUrls.PLACEHOLDER;
      }
    }
    
    return imageUrls.PLACEHOLDER;
  };

  // Handle image loading error
  const onError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      handleImageError(e, getFallbackSrc());
    }
  };

  // Handle image load success
  const handleLoad = () => {
    if (onLoad) {
      onLoad();
    }
  };

  // Add cache busting to remote URLs if needed
  const getImageUrl = (url: string) => {
    if (disableCacheBusting || !url || url.startsWith('/') || url.startsWith('data:')) {
      return url;
    }
    // Add timestamp as cache buster
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  };

  return (
    <img
      src={hasError ? getFallbackSrc() : getImageUrl(src)}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      onError={onError}
      onLoad={handleLoad}
      {...props}
    />
  );
};
