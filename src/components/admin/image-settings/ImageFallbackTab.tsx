
import React from 'react';
import { UploadModeSelector } from './';
import { ImagePreview } from './';

interface ImageFallbackTabProps {
  imageType: 'product' | 'category' | 'blog' | 'hero';
  imageUrl: string;
  setImageUrl: (url: string) => void;
  uploadMode: string;
  setUploadMode: (mode: string) => void;
  useLocalFallbacks: boolean;
  bucketName: 'product-images' | 'category-images' | 'blog-images';
  folderName: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
}

const ImageFallbackTab: React.FC<ImageFallbackTabProps> = ({
  imageType,
  imageUrl,
  setImageUrl,
  uploadMode,
  setUploadMode,
  useLocalFallbacks,
  bucketName,
  folderName,
  aspectRatio = 'square'
}) => {
  const handleUploadModeChange = (mode: string) => {
    setUploadMode(mode);
  };

  const handleFileUpload = (url: string) => {
    setImageUrl(url);
  };

  return (
    <div className="space-y-4 mt-4">
      <UploadModeSelector
        uploadMode={uploadMode}
        onUploadModeChange={handleUploadModeChange}
        imageUrl={imageUrl}
        onImageUrlChange={setImageUrl}
        onFileUpload={handleFileUpload}
        bucket={bucketName}
        folder={folderName}
        imageType={imageType}
        useLocalFallbacks={useLocalFallbacks}
        aspectRatio={aspectRatio}
      />
      
      <ImagePreview
        previewUrl={imageUrl}
        useLocalFallback={useLocalFallbacks}
        imageType={imageType}
      />
    </div>
  );
};

export default ImageFallbackTab;
