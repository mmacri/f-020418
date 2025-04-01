
import React, { useState, useEffect } from 'react';
import { handleImageError as logImageError } from './imageErrorHandlers';
import { imageUrls } from '@/lib/constants';

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  type?: 'product' | 'category' | 'blog' | 'hero';
  disableCacheBusting?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc,
  className,
  type = 'product',
  disableCacheBusting = false,
  onLoad,
  onError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Set default fallback based on image type
  const defaultFallback = () => {
    switch (type) {
      case 'product':
        return imageUrls.PRODUCT_DEFAULT;
      case 'category':
        return imageUrls.CATEGORY_DEFAULT;
      case 'blog':
        return 'https://ext.same-assets.com/1001010126/blog-placeholder.jpg';
      case 'hero':
        return imageUrls.HERO_DEFAULT;
      default:
        return 'https://placehold.co/600x400?text=Image+Not+Found';
    }
  };

  const actualFallback = fallbackSrc || defaultFallback();

  useEffect(() => {
    // Reset error state and update source when src prop changes
    if (src) {
      setImgSrc(src);
      setHasError(false);
      setIsLoaded(false);
      console.log(`Image source updated: ${src}`);
    }
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      console.error(`Image failed to load: ${imgSrc}, using fallback: ${actualFallback}`);
      // Log the error but don't pass arguments to avoid the TypeScript error
      logImageError(src || '');
      setImgSrc(actualFallback);
      setHasError(true);
      
      // Call the original onError handler if provided
      if (onError) {
        // Create a new synthetic event instead of trying to convert a native one
        onError({} as React.SyntheticEvent<HTMLImageElement, Event>);
      }
      
      // Dispatch an event that can be caught by parent components
      window.dispatchEvent(new CustomEvent('imageError', { 
        detail: { originalSrc: src, fallbackSrc: actualFallback, type } 
      }));
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    console.log(`Image loaded successfully: ${imgSrc}`);
    
    // Call the original onLoad handler if provided
    if (onLoad) {
      onLoad(e);
    }
  };

  // Add cache busting parameter if needed
  const getImageSrc = () => {
    if (disableCacheBusting || !imgSrc) return imgSrc;
    
    const cacheBuster = `_cb=${Date.now()}`;
    const separator = imgSrc.includes('?') ? '&' : '?';
    return `${imgSrc}${separator}${cacheBuster}`;
  };

  return (
    <img
      src={getImageSrc()}
      alt={alt || 'Image'}
      onError={handleError}
      onLoad={handleImageLoad}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};
