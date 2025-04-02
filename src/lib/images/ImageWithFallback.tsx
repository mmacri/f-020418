
import React, { useState, useEffect, useRef } from 'react';
import { handleImageError as logImageError } from './imageErrorHandlers';
import { imageUrls } from '@/lib/constants';

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  type?: keyof typeof import('@/lib/images/imageOptimizer').MAX_DIMENSIONS;
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
  const imgRef = useRef<HTMLImageElement>(null);
  const cacheKey = useRef<string>(`img_cache_${src}`);

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

  // Check for cached images
  useEffect(() => {
    if (!src) return;
    
    // Skip blob URLs and data URLs since they don't need caching
    if (src.startsWith('blob:') || src.startsWith('data:')) {
      setImgSrc(src);
      return;
    }

    // Check local storage for cached image status
    const cachedStatus = localStorage.getItem(cacheKey.current);
    if (cachedStatus === 'error') {
      // If we previously had an error with this image, use fallback immediately
      console.log(`Using cached fallback for ${src}`);
      setImgSrc(actualFallback);
      setHasError(true);
      setIsLoaded(true);
    } else {
      // Otherwise use the source image
      setImgSrc(src);
      setHasError(false);
      setIsLoaded(false);
      console.log(`Image source updated: ${src}`);
    }
  }, [src, actualFallback]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      console.error(`Image failed to load: ${imgSrc}, using fallback: ${actualFallback}`);
      
      // Cache the error status to avoid future requests for the same broken image
      if (src && !src.startsWith('blob:') && !src.startsWith('data:')) {
        localStorage.setItem(cacheKey.current, 'error');
      }
      
      // Log the error but don't pass arguments to avoid TypeScript error
      logImageError(imgSrc || '');
      setImgSrc(actualFallback);
      setHasError(true);
      
      // Call the original onError handler if provided
      if (onError) {
        onError(e);
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
    // Skip cache busting for blob URLs, data URLs, or if disabled
    if (disableCacheBusting || !imgSrc || imgSrc.startsWith('blob:') || imgSrc.startsWith('data:')) {
      return imgSrc;
    }
    
    // Only add cache busting for external URLs, not for local assets
    if (imgSrc.startsWith('/')) {
      return imgSrc;
    }
    
    const cacheBuster = `_cb=${Date.now()}`;
    const separator = imgSrc.includes('?') ? '&' : '?';
    return `${imgSrc}${separator}${cacheBuster}`;
  };

  return (
    <img
      ref={imgRef}
      src={getImageSrc()}
      alt={alt || 'Image'}
      onError={handleError}
      onLoad={handleImageLoad}
      className={className}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};
