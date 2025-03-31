
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import FileUploadWithPreview from '@/components/FileUploadWithPreview';

interface UploadModeSelectorProps {
  uploadMode: string;
  onUploadModeChange: (mode: string) => void;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  onFileUpload: (url: string) => void;
  bucket: 'product-images' | 'category-images' | 'blog-images';
  folder: string;
  imageType: 'product' | 'category' | 'blog' | 'hero';
  useLocalFallbacks: boolean;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
}

const UploadModeSelector: React.FC<UploadModeSelectorProps> = ({
  uploadMode,
  onUploadModeChange,
  imageUrl,
  onImageUrlChange,
  onFileUpload,
  bucket,
  folder,
  imageType,
  useLocalFallbacks,
  aspectRatio = 'landscape',
}) => {
  return (
    <Tabs defaultValue={uploadMode} onValueChange={onUploadModeChange}>
      <TabsList className="grid grid-cols-2 w-60">
        <TabsTrigger value="url">URL</TabsTrigger>
        <TabsTrigger value="upload">Upload</TabsTrigger>
      </TabsList>
      
      <TabsContent value="url" className="space-y-4 mt-4">
        <div>
          <Label htmlFor={`${imageType}FallbackUrl`}>{imageType.charAt(0).toUpperCase() + imageType.slice(1)} Fallback Image URL</Label>
          <Input
            id={`${imageType}FallbackUrl`}
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
            className="mt-1"
            disabled={useLocalFallbacks}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="upload" className="space-y-4 mt-4">
        <FileUploadWithPreview
          onFileChange={onFileUpload}
          currentImage={imageUrl}
          bucket={bucket}
          folder={folder}
          maxSize={imageType === 'hero' ? 3 : 2}
          aspectRatio={aspectRatio}
          className="w-full"
        />
      </TabsContent>
    </Tabs>
  );
};

export default UploadModeSelector;
