
import React from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import FileUploadWithPreview from '@/components/file-upload/FileUploadWithPreview';

interface HeroImageTabsProps {
  uploadTab: string;
  setUploadTab: (tab: string) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  handleSave: () => void;
  handleFileUpload: (url: string) => void;
}

const HeroImageTabs: React.FC<HeroImageTabsProps> = ({
  uploadTab,
  setUploadTab,
  imageUrl,
  setImageUrl,
  handleSave,
  handleFileUpload,
}) => {
  return (
    <Tabs defaultValue={uploadTab} onValueChange={setUploadTab} className="w-full">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="url">Image URL</TabsTrigger>
        <TabsTrigger value="upload">Upload Image</TabsTrigger>
      </TabsList>
      
      <TabsContent value="url" className="space-y-4 mt-4">
        <div className="space-y-2">
          <label htmlFor="heroImage" className="text-sm font-medium">
            Hero Image URL
          </label>
          <Input
            id="heroImage"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            aria-describedby="heroImageHelp"
          />
          <p id="heroImageHelp" className="text-xs text-muted-foreground">
            Enter a valid URL for the hero image. Recommended size: 1920x600px.
          </p>
        </div>
        <Button onClick={handleSave} className="mt-2">
          Save URL
        </Button>
      </TabsContent>
      
      <TabsContent value="upload" className="space-y-4 mt-4">
        <FileUploadWithPreview
          onFileChange={handleFileUpload}
          currentImage={imageUrl}
          bucket="product-images"
          folder="hero"
          maxSize={5}
          aspectRatio="landscape"
        />
        <p className="text-xs text-muted-foreground">
          Upload a hero image. Recommended size: 1920x600px. Maximum file size: 5MB.
        </p>
      </TabsContent>
    </Tabs>
  );
};

export default HeroImageTabs;
