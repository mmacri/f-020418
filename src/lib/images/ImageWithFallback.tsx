
import React, { useState } from 'react';
import { handleImageError } from './imageErrorHandlers';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = "https://placehold.co/600x400?text=Image+Not+Found",
  className,
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
