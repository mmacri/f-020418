
import React from 'react';
import { ImageWithFallback } from '@/lib/images';
import { imageUrls } from '@/lib/constants';

interface HeroImagePreviewProps {
  previewUrl: string;
  useLocalFallback: boolean;
}

const HeroImagePreview: React.FC<HeroImagePreviewProps> = ({ 
  previewUrl, 
  useLocalFallback 
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <span className="text-sm font-medium">Preview</span>
      <div className="border rounded-md p-2 bg-gray-50 h-48 flex items-center justify-center overflow-hidden">
        {previewUrl && (
          <ImageWithFallback
            src={previewUrl}
            alt="Hero Preview"
            className="max-h-full max-w-full object-contain"
            fallbackSrc={useLocalFallback ? '/placeholder.svg' : imageUrls.HERO_DEFAULT}
            type="hero"
          />
        )}
      </div>
    </div>
  );
};

export default HeroImagePreview;
