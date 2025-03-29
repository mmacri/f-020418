
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { localStorageKeys } from '@/lib/constants';
import { ImageWithFallback } from '@/lib/image-utils';

const ImageSettingsPanel: React.FC = () => {
  const [useLocalFallbacks, setUseLocalFallbacks] = useState<boolean>(false);
  const [productFallbackUrl, setProductFallbackUrl] = useState<string>('');
  const [categoryFallbackUrl, setCategoryFallbackUrl] = useState<string>('');
  const [blogFallbackUrl, setBlogFallbackUrl] = useState<string>('');
  const [heroFallbackUrl, setHeroFallbackUrl] = useState<string>('');
  const { toast } = useToast();
  
  useEffect(() => {
    // Load current settings
    const useLocal = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
    setUseLocalFallbacks(useLocal);
    
    // Load current fallback URLs
    setProductFallbackUrl(localStorage.getItem('product_fallback_url') || 'https://ext.same-assets.com/1001010126/product-placeholder.jpg');
    setCategoryFallbackUrl(localStorage.getItem('category_fallback_url') || 'https://ext.same-assets.com/1001010126/category-placeholder.jpg');
    setBlogFallbackUrl(localStorage.getItem('blog_fallback_url') || 'https://ext.same-assets.com/1001010126/blog-placeholder.jpg');
    setHeroFallbackUrl(localStorage.getItem('hero_fallback_url') || 'https://ext.same-assets.com/1001010126/hero-placeholder.jpg');
  }, []);
  
  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem(localStorageKeys.USE_LOCAL_FALLBACKS, useLocalFallbacks.toString());
    localStorage.setItem('product_fallback_url', productFallbackUrl);
    localStorage.setItem('category_fallback_url', categoryFallbackUrl);
    localStorage.setItem('blog_fallback_url', blogFallbackUrl);
    localStorage.setItem('hero_fallback_url', heroFallbackUrl);
    
    toast({
      title: 'Settings Saved',
      description: 'Your image fallback settings have been updated.',
    });
  };
  
  const handleResetDefaults = () => {
    // Reset to defaults
    setUseLocalFallbacks(false);
    setProductFallbackUrl('https://ext.same-assets.com/1001010126/product-placeholder.jpg');
    setCategoryFallbackUrl('https://ext.same-assets.com/1001010126/category-placeholder.jpg');
    setBlogFallbackUrl('https://ext.same-assets.com/1001010126/blog-placeholder.jpg');
    setHeroFallbackUrl('https://ext.same-assets.com/1001010126/hero-placeholder.jpg');
    
    // Save defaults to localStorage
    localStorage.setItem(localStorageKeys.USE_LOCAL_FALLBACKS, 'false');
    localStorage.setItem('product_fallback_url', 'https://ext.same-assets.com/1001010126/product-placeholder.jpg');
    localStorage.setItem('category_fallback_url', 'https://ext.same-assets.com/1001010126/category-placeholder.jpg');
    localStorage.setItem('blog_fallback_url', 'https://ext.same-assets.com/1001010126/blog-placeholder.jpg');
    localStorage.setItem('hero_fallback_url', 'https://ext.same-assets.com/1001010126/hero-placeholder.jpg');
    
    toast({
      title: 'Defaults Restored',
      description: 'Image fallback settings have been reset to defaults.',
    });
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
        
        <Tabs defaultValue="product">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="product">Products</TabsTrigger>
            <TabsTrigger value="category">Categories</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
          </TabsList>
          
          <TabsContent value="product" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="productFallbackUrl">Product Fallback Image URL</Label>
                <Input
                  id="productFallbackUrl"
                  value={productFallbackUrl}
                  onChange={(e) => setProductFallbackUrl(e.target.value)}
                  className="mt-1"
                  disabled={useLocalFallbacks}
                />
              </div>
              <div className="flex justify-center items-center border rounded-md p-4 bg-gray-50 h-48">
                {useLocalFallbacks ? (
                  <ImageWithFallback
                    src="/placeholder.svg"
                    alt="Local product fallback"
                    className="max-h-full"
                  />
                ) : (
                  <ImageWithFallback
                    src={productFallbackUrl}
                    alt="Product fallback preview"
                    className="max-h-full"
                  />
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="category" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="categoryFallbackUrl">Category Fallback Image URL</Label>
                <Input
                  id="categoryFallbackUrl"
                  value={categoryFallbackUrl}
                  onChange={(e) => setCategoryFallbackUrl(e.target.value)}
                  className="mt-1"
                  disabled={useLocalFallbacks}
                />
              </div>
              <div className="flex justify-center items-center border rounded-md p-4 bg-gray-50 h-48">
                {useLocalFallbacks ? (
                  <ImageWithFallback
                    src="/placeholder.svg"
                    alt="Local category fallback"
                    className="max-h-full"
                  />
                ) : (
                  <ImageWithFallback
                    src={categoryFallbackUrl}
                    alt="Category fallback preview"
                    className="max-h-full"
                  />
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="blog" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="blogFallbackUrl">Blog Fallback Image URL</Label>
                <Input
                  id="blogFallbackUrl"
                  value={blogFallbackUrl}
                  onChange={(e) => setBlogFallbackUrl(e.target.value)}
                  className="mt-1"
                  disabled={useLocalFallbacks}
                />
              </div>
              <div className="flex justify-center items-center border rounded-md p-4 bg-gray-50 h-48">
                {useLocalFallbacks ? (
                  <ImageWithFallback
                    src="/placeholder.svg"
                    alt="Local blog fallback"
                    className="max-h-full"
                  />
                ) : (
                  <ImageWithFallback
                    src={blogFallbackUrl}
                    alt="Blog fallback preview"
                    className="max-h-full"
                  />
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="hero" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="heroFallbackUrl">Hero Fallback Image URL</Label>
                <Input
                  id="heroFallbackUrl"
                  value={heroFallbackUrl}
                  onChange={(e) => setHeroFallbackUrl(e.target.value)}
                  className="mt-1"
                  disabled={useLocalFallbacks}
                />
              </div>
              <div className="flex justify-center items-center border rounded-md p-4 bg-gray-50 h-48">
                {useLocalFallbacks ? (
                  <ImageWithFallback
                    src="/placeholder.svg"
                    alt="Local hero fallback"
                    className="max-h-full"
                  />
                ) : (
                  <ImageWithFallback
                    src={heroFallbackUrl}
                    alt="Hero fallback preview"
                    className="max-h-full"
                  />
                )}
              </div>
            </div>
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
