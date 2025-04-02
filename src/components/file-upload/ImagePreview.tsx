
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/lib/images';
import { Loader2 } from 'lucide-react';

interface ImagePreviewProps {
  preview: string | null;
  isUploading: boolean;
  onClear: () => void;
  aspectRatio: 'square' | 'landscape' | 'portrait';
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  preview,
  isUploading,
  onClear,
  aspectRatio
}) => {
  if (!preview) return null;
  
  const aspectRatioClass = 
    aspectRatio === 'landscape' ? 'aspect-video' : 
    aspectRatio === 'portrait' ? 'aspect-[3/4]' : 
    'aspect-square';

  // Determine if this is a blob URL that needs special handling
  const isBlobUrl = preview.startsWith('blob:');

  return (
    <div className="space-y-2">
      <div className={`relative rounded-md overflow-hidden border bg-gray-50 ${aspectRatioClass}`}>
        <ImageWithFallback
          src={preview}
          alt="Preview"
          className="w-full h-full object-contain"
          type="product"
          disableCacheBusting={isBlobUrl} // Disable cache busting for blob URLs
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onClear} 
        type="button"
        className="mt-2"
        disabled={isUploading}
        aria-label="Clear image preview"
      >
        Clear Preview
      </Button>
    </div>
  );
};

export default ImagePreview;
