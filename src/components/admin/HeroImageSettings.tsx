
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { localStorageKeys, imageUrls } from '@/lib/constants';
import { ImageWithFallback } from '@/lib/images';
import FileUploadWithPreview from '@/components/file-upload/FileUploadWithPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HeroImageSettings: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [useLocalFallback, setUseLocalFallback] = useState<boolean>(false);
  const [uploadTab, setUploadTab] = useState<string>('url');
  const { toast } = useToast();

  useEffect(() => {
    // Load the existing hero image URL from localStorage
    const savedImage = localStorage.getItem(localStorageKeys.HERO_IMAGE) || imageUrls.HERO_DEFAULT;
    console.log('HeroImageSettings loading saved image:', savedImage);
    setImageUrl(savedImage);
    setPreviewUrl(savedImage);
    
    // Check if we should use local fallback
    const useLocal = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
    setUseLocalFallback(useLocal);
  }, []);

  const broadcastHeroImageUpdate = (url: string) => {
    console.log('Broadcasting hero image update:', url);
    
    // Save immediately to localStorage
    localStorage.setItem(localStorageKeys.HERO_IMAGE, url);
    localStorage.setItem('hero_fallback_url', url);
    
    // Trigger a custom event to notify other components that hero image has been updated
    const event = new CustomEvent('heroImageUpdated', { 
      detail: { imageUrl: url }
    });
    
    window.dispatchEvent(event);
  };

  const handleSave = () => {
    try {
      // Save the hero image URL to localStorage
      localStorage.setItem(localStorageKeys.HERO_IMAGE, imageUrl);
      localStorage.setItem(localStorageKeys.USE_LOCAL_FALLBACKS, useLocalFallback.toString());
      localStorage.setItem('hero_fallback_url', imageUrl);
      setPreviewUrl(imageUrl);
      
      console.log('Hero image updated in localStorage:', imageUrl);
      
      // Broadcast the update to other components
      broadcastHeroImageUpdate(imageUrl);
      
      toast({
        title: "Success",
        description: "Hero image updated successfully. The home page will reflect the changes immediately.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error saving hero image:', error);
      toast({
        title: "Error",
        description: "Failed to update hero image",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    const defaultImage = imageUrls.HERO_DEFAULT;
    setImageUrl(defaultImage);
    setPreviewUrl(defaultImage);
    localStorage.setItem(localStorageKeys.HERO_IMAGE, defaultImage);
    localStorage.setItem('hero_fallback_url', defaultImage);
    
    // Broadcast the update to other components
    broadcastHeroImageUpdate(defaultImage);
    
    toast({
      title: "Reset Complete",
      description: "Hero image has been reset to default",
    });
  };

  const handleFileUpload = (url: string) => {
    if (!url) return;
    
    console.log('Setting hero image from upload:', url);
    setImageUrl(url);
    setPreviewUrl(url);
    
    // Immediately save and broadcast the update
    broadcastHeroImageUpdate(url);
    
    toast({
      title: "Image Updated",
      description: "Hero image has been updated successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Image Settings</CardTitle>
        <CardDescription>
          Customize the main hero image displayed on the homepage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
              currentImage={imageUrl !== imageUrls.HERO_DEFAULT ? imageUrl : undefined}
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
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useLocalFallback"
            checked={useLocalFallback}
            onChange={(e) => setUseLocalFallback(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="useLocalFallback" className="text-sm font-medium">
            Use local placeholder if image fails to load
          </label>
        </div>
        
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium">Preview</span>
          <div className="border rounded-md p-2 bg-gray-50 h-48 flex items-center justify-center overflow-hidden">
            <ImageWithFallback
              src={previewUrl}
              alt="Hero Preview"
              className="max-h-full max-w-full object-contain"
              fallbackSrc={useLocalFallback ? '/placeholder.svg' : imageUrls.HERO_DEFAULT}
              type="hero"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700" aria-label="Save hero image changes">
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleReset} aria-label="Reset hero image to default">
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroImageSettings;
