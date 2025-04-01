
import React, { useState } from 'react';
import { handleImageError } from './imageErrorHandlers';

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  type?: string; // Add support for type
  disableCacheBusting?: boolean; // Add support for disableCacheBusting
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = "https://placehold.co/600x400?text=Image+Not+Found",
  className,
  type, // New prop
  disableCacheBusting, // New prop
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);

  const handleError = () => {
    handleImageError(src || '');
    setImgSrc(fallbackSrc);
  };

  return (
    <img
      src={imgSrc}
      alt={alt || 'Image'}
      onError={handleError}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};
