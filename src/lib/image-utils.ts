
import React, { useState } from 'react';

export interface ImageFallbackOptions {
  defaultImage?: string;
  localFallbackImage?: string;
}

/**
 * Custom hook for handling image fallbacks
 */
export const useImageWithFallback = (initialSrc: string, options: ImageFallbackOptions = {}) => {
  const { defaultImage = '', localFallbackImage = '/placeholder.svg' } = options;
  const [imageUrl, setImageUrl] = useState<string>(initialSrc);
  const [fallbackTriggered, setFallbackTriggered] = useState<boolean>(false);

  const handleImageError = () => {
    if (!fallbackTriggered) {
      // First try the defaultImage if provided
      if (defaultImage && imageUrl !== defaultImage) {
        setImageUrl(defaultImage);
      } else {
        // Fallback to local image as last resort
        setImageUrl(localFallbackImage);
      }
      setFallbackTriggered(true);
    }
  };

  return { imageUrl, handleImageError, fallbackTriggered };
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
  if (url.startsWith('http') || url.startsWith('/')) {
    return url;
  }
  
  // Handle empty URLs
  if (!url) {
    return '/placeholder.svg';
  }
  
  // Construct URL based on type and size
  // This is a placeholder implementation - in a real app, 
  // you might use a CDN with image transformations
  switch (type) {
    case 'product':
      // Example: Return product images with appropriate sizing
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
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  type = 'general',
  ...props
}) => {
  const { imageUrl, handleImageError } = useImageWithFallback(src, {
    defaultImage: '',
    localFallbackImage: fallbackSrc
  });

  return (
    <img
      src={imageUrl}
      alt={alt}
      onError={handleImageError}
      {...props}
    />
  );
};
