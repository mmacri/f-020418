
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { localStorageKeys, imageUrls } from '@/lib/constants';
import { HeroImagePreview, HeroImageTabs, HeroImageActions } from './';

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
    if (!url) return;
    
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
      if (!imageUrl) {
        toast({
          title: "Error",
          description: "Please enter a valid image URL",
          variant: "destructive",
        });
        return;
      }
      
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
        <HeroImageTabs
          uploadTab={uploadTab}
          setUploadTab={setUploadTab}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          handleSave={handleSave}
          handleFileUpload={handleFileUpload}
        />
        
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
        
        <HeroImagePreview 
          previewUrl={previewUrl}
          useLocalFallback={useLocalFallback}
        />

        <HeroImageActions 
          handleSave={handleSave}
          handleReset={handleReset}
        />
      </CardContent>
    </Card>
  );
};

export default HeroImageSettings;
