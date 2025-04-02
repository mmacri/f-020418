
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogImageForm } from './index';
import { BlogImagePreview } from './index';

interface BlogImageTabsProps {
  currentImage?: string;
  onImageSelect: (url: string) => void;
  onClose: () => void;
}

const BlogImageTabs: React.FC<BlogImageTabsProps> = ({
  currentImage,
  onImageSelect,
  onClose
}) => {
  const [uploadMode, setUploadMode] = useState<string>('upload');
  const [imageUrl, setImageUrl] = useState<string>(currentImage || '');
  
  const handleTabChange = (value: string) => {
    setUploadMode(value);
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
  };

  const handleUploadSuccess = (url: string) => {
    setImageUrl(url);
    onImageSelect(url);
  };

  const handleSubmitUrl = () => {
    if (imageUrl) {
      onImageSelect(imageUrl);
    }
  };

  return (
    <Tabs defaultValue="upload" className="mt-4" onValueChange={handleTabChange}>
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="url">URL</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload" className="space-y-4 py-4">
        <BlogImageForm 
          mode="upload"
          imageUrl={imageUrl}
          onUrlChange={handleUrlChange}
          onUploadSuccess={handleUploadSuccess}
        />
        
        {currentImage && (
          <BlogImagePreview 
            title="Current Image" 
            imageUrl={currentImage} 
          />
        )}
      </TabsContent>
      
      <TabsContent value="url" className="space-y-4 py-4">
        <BlogImageForm 
          mode="url"
          imageUrl={imageUrl}
          onUrlChange={handleUrlChange}
          onSubmit={handleSubmitUrl}
        />
        
        {imageUrl && (
          <BlogImagePreview 
            title="Preview" 
            imageUrl={imageUrl} 
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default BlogImageTabs;
