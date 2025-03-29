
import React from 'react';
import { imageUrls, localStorageKeys } from '../constants';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  type?: 'product' | 'category' | 'hero' | 'blog';
  disableCacheBusting?: boolean;
  onLoad?: () => void;
  loading?: 'lazy' | 'eager';
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
  loading,
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
      loading={loading}
    />
  );
};
