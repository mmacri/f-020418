
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { localStorageKeys } from '@/lib/constants';

const DEFAULT_HERO_IMAGE = "https://static.vecteezy.com/system/resources/previews/021/573/353/non_2x/arm-muscle-silhouette-logo-biceps-icon-free-vector.jpg";

const HeroImageSettings: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // Load the existing hero image URL from localStorage
    const savedImage = localStorage.getItem(localStorageKeys.HERO_IMAGE) || DEFAULT_HERO_IMAGE;
    setImageUrl(savedImage);
    setPreviewUrl(savedImage);
  }, []);

  const handleSave = () => {
    try {
      // Save the hero image URL to localStorage
      localStorage.setItem(localStorageKeys.HERO_IMAGE, imageUrl);
      setPreviewUrl(imageUrl);
      
      toast({
        title: "Success",
        description: "Hero image updated successfully",
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
    setImageUrl(DEFAULT_HERO_IMAGE);
    setPreviewUrl(DEFAULT_HERO_IMAGE);
    localStorage.setItem(localStorageKeys.HERO_IMAGE, DEFAULT_HERO_IMAGE);
    toast({
      title: "Reset Complete",
      description: "Hero image has been reset to default",
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
        <div className="space-y-2">
          <label htmlFor="heroImage" className="text-sm font-medium">
            Hero Image URL
          </label>
          <Input
            id="heroImage"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium">Preview</span>
          <div className="border rounded-md p-2 bg-gray-50 h-48 flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Hero Preview"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = DEFAULT_HERO_IMAGE;
                  setPreviewUrl(DEFAULT_HERO_IMAGE);
                  toast({
                    title: "Invalid Image",
                    description: "The image URL is invalid. Using default image instead.",
                    variant: "destructive",
                  });
                }}
              />
            ) : (
              <div className="text-gray-400">No image preview available</div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroImageSettings;
