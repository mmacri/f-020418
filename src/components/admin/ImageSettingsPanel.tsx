import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { localStorageKeys, imageUrls } from '@/lib/constants';
import { ImageWithFallback } from '@/lib/images';
import FileUploadWithPreview from '@/components/FileUploadWithPreview';

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

  const handleFileUpload = (url: string, type: 'product' | 'category' | 'blog' | 'hero') => {
    switch (type) {
      case 'product':
        setProductFallbackUrl(url);
        break;
      case 'category':
        setCategoryFallbackUrl(url);
        break;
      case 'blog':
        setBlogFallbackUrl(url);
        break;
      case 'hero':
        setHeroFallbackUrl(url);
        break;
    }
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
          
          <TabsContent value="product" className="space-y-4 mt-4">
            <Tabs defaultValue={uploadMode.product} onValueChange={(value) => handleUploadModeChange('product', value)}>
              <TabsList className="grid grid-cols-2 w-60">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="space-y-4 mt-4">
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
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-4 mt-4">
                <FileUploadWithPreview
                  onFileChange={(url) => handleFileUpload(url, 'product')}
                  currentImage={productFallbackUrl}
                  bucket="product-images"
                  folder="fallbacks"
                  maxSize={2}
                  aspectRatio="square"
                  className="w-full"
                />
              </TabsContent>
            </Tabs>
            
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
          </TabsContent>
          
          <TabsContent value="category" className="space-y-4 mt-4">
            <Tabs defaultValue={uploadMode.category} onValueChange={(value) => handleUploadModeChange('category', value)}>
              <TabsList className="grid grid-cols-2 w-60">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="space-y-4 mt-4">
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
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-4 mt-4">
                <FileUploadWithPreview
                  onFileChange={(url) => handleFileUpload(url, 'category')}
                  currentImage={categoryFallbackUrl}
                  bucket="category-images"
                  folder="fallbacks"
                  maxSize={2}
                  aspectRatio="landscape"
                  className="w-full"
                />
              </TabsContent>
            </Tabs>
            
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
          </TabsContent>
          
          <TabsContent value="blog" className="space-y-4 mt-4">
            <Tabs defaultValue={uploadMode.blog} onValueChange={(value) => handleUploadModeChange('blog', value)}>
              <TabsList className="grid grid-cols-2 w-60">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="space-y-4 mt-4">
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
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-4 mt-4">
                <FileUploadWithPreview
                  onFileChange={(url) => handleFileUpload(url, 'blog')}
                  currentImage={blogFallbackUrl}
                  bucket="blog-images"
                  folder="fallbacks"
                  maxSize={2}
                  aspectRatio="landscape"
                  className="w-full"
                />
              </TabsContent>
            </Tabs>
            
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
          </TabsContent>
          
          <TabsContent value="hero" className="space-y-4 mt-4">
            <Tabs defaultValue={uploadMode.hero} onValueChange={(value) => handleUploadModeChange('hero', value)}>
              <TabsList className="grid grid-cols-2 w-60">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="space-y-4 mt-4">
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
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-4 mt-4">
                <FileUploadWithPreview
                  onFileChange={(url) => handleFileUpload(url, 'hero')}
                  currentImage={heroFallbackUrl}
                  bucket="product-images"
                  folder="hero"
                  maxSize={3}
                  aspectRatio="landscape"
                  className="w-full"
                />
              </TabsContent>
            </Tabs>
            
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
