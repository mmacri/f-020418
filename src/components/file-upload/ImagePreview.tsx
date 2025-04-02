
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

export const ImagePreview: React.FC<ImagePreviewProps> = ({
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

  return (
    <div className="space-y-2">
      <div className={`relative rounded-md overflow-hidden border bg-gray-50 ${aspectRatioClass}`}>
        <ImageWithFallback
          src={preview}
          alt="Preview"
          className="w-full h-full object-contain"
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
      >
        Clear Preview
      </Button>
    </div>
  );
};

export default ImagePreview;
