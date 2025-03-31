
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { localStorageKeys, imageUrls } from '@/lib/constants';
import { ImageFallbackTab } from './';

const ImageSettingsPanel: React.FC = () => {
  const [useLocalFallbacks, setUseLocalFallbacks] = useState<boolean>(false);
  const [productFallbackUrl, setProductFallbackUrl] = useState<string>('');
  const [categoryFallbackUrl, setCategoryFallbackUrl] = useState<string>('');
  const [blogFallbackUrl, setBlogFallbackUrl] = useState<string>('');
  const [heroFallbackUrl, setHeroFallbackUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('product');
  const [uploadMode, setUploadMode] = useState<Record<string, string>>({
    product: 'url',
    category: 'url',
    blog: 'url',
    hero: 'url'
  });
  const { toast } = useToast();
  
  useEffect(() => {
    const useLocal = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
    setUseLocalFallbacks(useLocal);
    
    setProductFallbackUrl(localStorage.getItem('product_fallback_url') || imageUrls.PRODUCT_DEFAULT);
    setCategoryFallbackUrl(localStorage.getItem('category_fallback_url') || imageUrls.CATEGORY_DEFAULT);
    setBlogFallbackUrl(localStorage.getItem('blog_fallback_url') || 'https://ext.same-assets.com/1001010126/blog-placeholder.jpg');
    setHeroFallbackUrl(localStorage.getItem('hero_fallback_url') || imageUrls.HERO_DEFAULT);
  }, []);
  
  const handleSaveSettings = () => {
    localStorage.setItem(localStorageKeys.USE_LOCAL_FALLBACKS, useLocalFallbacks.toString());
    localStorage.setItem('product_fallback_url', productFallbackUrl);
    localStorage.setItem('category_fallback_url', categoryFallbackUrl);
    localStorage.setItem('blog_fallback_url', blogFallbackUrl);
    localStorage.setItem('hero_fallback_url', heroFallbackUrl);
    localStorage.setItem(localStorageKeys.HERO_IMAGE, heroFallbackUrl);
    
    toast({
      title: 'Settings Saved',
      description: 'Your image fallback settings have been updated.',
    });
  };
  
  const handleResetDefaults = () => {
    setUseLocalFallbacks(false);
    setProductFallbackUrl(imageUrls.PRODUCT_DEFAULT);
    setCategoryFallbackUrl(imageUrls.CATEGORY_DEFAULT);
    setBlogFallbackUrl('https://ext.same-assets.com/1001010126/blog-placeholder.jpg');
    setHeroFallbackUrl(imageUrls.HERO_DEFAULT);
    
    localStorage.setItem(localStorageKeys.USE_LOCAL_FALLBACKS, 'false');
    localStorage.setItem('product_fallback_url', imageUrls.PRODUCT_DEFAULT);
    localStorage.setItem('category_fallback_url', imageUrls.CATEGORY_DEFAULT);
    localStorage.setItem('blog_fallback_url', 'https://ext.same-assets.com/1001010126/blog-placeholder.jpg');
    localStorage.setItem('hero_fallback_url', imageUrls.HERO_DEFAULT);
    localStorage.setItem(localStorageKeys.HERO_IMAGE, imageUrls.HERO_DEFAULT);
    
    toast({
      title: 'Defaults Restored',
      description: 'Image fallback settings have been reset to defaults.',
    });
  };

  const handleUploadModeChange = (tab: string, mode: string) => {
    setUploadMode(prev => ({ ...prev, [tab]: mode }));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Fallback Settings</CardTitle>
        <CardDescription>
          Configure how images should be handled when they fail to load
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Use Local Fallbacks</h3>
            <p className="text-sm text-gray-500">
              When enabled, all broken images will use local placeholder images instead of external fallbacks
            </p>
          </div>
          <Switch
            checked={useLocalFallbacks}
            onCheckedChange={setUseLocalFallbacks}
            aria-label="Toggle local fallback images"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="product">Products</TabsTrigger>
            <TabsTrigger value="category">Categories</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
          </TabsList>
          
          <TabsContent value="product">
            <ImageFallbackTab
              imageType="product"
              imageUrl={productFallbackUrl}
              setImageUrl={setProductFallbackUrl}
              uploadMode={uploadMode.product}
              setUploadMode={(mode) => handleUploadModeChange('product', mode)}
              useLocalFallbacks={useLocalFallbacks}
              bucketName="product-images"
              folderName="fallbacks"
              aspectRatio="square"
            />
          </TabsContent>
          
          <TabsContent value="category">
            <ImageFallbackTab
              imageType="category"
              imageUrl={categoryFallbackUrl}
              setImageUrl={setCategoryFallbackUrl}
              uploadMode={uploadMode.category}
              setUploadMode={(mode) => handleUploadModeChange('category', mode)}
              useLocalFallbacks={useLocalFallbacks}
              bucketName="category-images"
              folderName="fallbacks"
              aspectRatio="landscape"
            />
          </TabsContent>
          
          <TabsContent value="blog">
            <ImageFallbackTab
              imageType="blog"
              imageUrl={blogFallbackUrl}
              setImageUrl={setBlogFallbackUrl}
              uploadMode={uploadMode.blog}
              setUploadMode={(mode) => handleUploadModeChange('blog', mode)}
              useLocalFallbacks={useLocalFallbacks}
              bucketName="blog-images"
              folderName="fallbacks"
              aspectRatio="landscape"
            />
          </TabsContent>
          
          <TabsContent value="hero">
            <ImageFallbackTab
              imageType="hero"
              imageUrl={heroFallbackUrl}
              setImageUrl={setHeroFallbackUrl}
              uploadMode={uploadMode.hero}
              setUploadMode={(mode) => handleUploadModeChange('hero', mode)}
              useLocalFallbacks={useLocalFallbacks}
              bucketName="product-images"
              folderName="hero"
              aspectRatio="landscape"
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex gap-4">
          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
          <Button variant="outline" onClick={handleResetDefaults}>
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageSettingsPanel;
