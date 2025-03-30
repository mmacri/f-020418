
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
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = imageUrls.PLACEHOLDER,
  className = '',
  width,
  height,
  loading = 'lazy',
  disableCacheBusting = false,
  onLoad,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  // Handle image loading error
  const onError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      handleImageError(e, fallbackSrc);
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
      src={hasError ? fallbackSrc : getImageUrl(src)}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      onError={onError}
      onLoad={onLoad}
      {...props}
    />
  );
};
