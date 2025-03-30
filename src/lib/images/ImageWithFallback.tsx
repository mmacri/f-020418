
import React, { useState, useEffect } from 'react';
import { imageUrls } from '@/lib/constants';
import { handleImageError } from './imageErrorHandlers';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  type?: 'product' | 'category' | 'blog' | 'avatar';
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;
  onError?: () => void;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  type = 'product',
  width,
  height,
  onLoad,
  onError
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const getDefaultFallback = () => {
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

  const actualFallback = fallbackSrc || getDefaultFallback();

  const handleError = () => {
    if (!hasError) {
      console.warn(`Image failed to load: ${src}`);
      setImgSrc(actualFallback);
      setHasError(true);
      if (onError) onError();
    }
  };

  return (
    <img
      src={imgSrc || actualFallback}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={handleError}
      onLoad={onLoad}
    />
  );
};
