
import React from 'react';
import { ImageWithFallback } from '@/lib/images';

interface ImagePreviewProps {
  previewUrl: string;
  useLocalFallback: boolean;
  imageType: 'product' | 'category' | 'blog' | 'hero';
  fallbackUrl?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  previewUrl,
  useLocalFallback,
  imageType,
  fallbackUrl = '/placeholder.svg'
}) => {
  return (
    <div className="flex justify-center items-center border rounded-md p-4 bg-gray-50 h-48">
      {useLocalFallback ? (
        <ImageWithFallback
          src="/placeholder.svg"
          alt={`Local ${imageType} fallback`}
          className="max-h-full"
        />
      ) : (
        <ImageWithFallback
          src={previewUrl}
          alt={`${imageType} fallback preview`}
          className="max-h-full"
        />
      )}
    </div>
  );
};

export default ImagePreview;
