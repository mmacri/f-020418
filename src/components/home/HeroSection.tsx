
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { localStorageKeys, imageUrls } from '@/lib/constants';
import { ImageWithFallback } from '@/lib/images';
import FileUploadWithPreview from '@/components/FileUploadWithPreview';
import { uploadFile } from '@/lib/file-upload';

const HeroSection: React.FC = () => {
  const [heroImageUrl, setHeroImageUrl] = useState<string>(imageUrls.HERO_DEFAULT);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [showUploader, setShowUploader] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  useEffect(() => {
    // Try to load the hero image from localStorage
    const savedImage = localStorage.getItem(localStorageKeys.HERO_IMAGE);
    if (savedImage) {
      setHeroImageUrl(savedImage);
    }
    
    // Log for debugging
    console.log('Hero image loaded:', savedImage || imageUrls.HERO_DEFAULT);
  }, []);

  const handleImageUpload = (url: string) => {
    if (url) {
      setHeroImageUrl(url);
      localStorage.setItem(localStorageKeys.HERO_IMAGE, url);
      setShowUploader(false);
    }
  };
  
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const { url, error } = await uploadFile(file, {
        bucket: 'product-images',
        folder: 'hero',
        fileTypes: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        maxSize: 5 * 1024 * 1024 // 5MB
      });
      
      if (error) {
        console.error('Error uploading hero image:', error);
        return;
      }
      
      handleImageUpload(url);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-indigo-700 to-purple-700 text-white py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find the Best Recovery Equipment
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Expert reviews and comparisons of the top recovery tools to help you perform better, recover faster, and prevent injuries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold border border-white shadow-md"
                asChild
              >
                <Link to="/products">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Shop All Products
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-2 border-white text-white hover:bg-white/20 font-semibold"
                asChild
              >
                <Link to="/blog">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            {/* Hero image upload controls */}
            <div className="mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/70 hover:text-white border border-white/20"
                onClick={() => setShowUploader(!showUploader)}
              >
                {showUploader ? 'Cancel' : 'Change Hero Image'}
              </Button>
            </div>
            
            {showUploader && (
              <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <FileUploadWithPreview
                  onFileChange={handleImageUpload}
                  currentImage={heroImageUrl !== imageUrls.HERO_DEFAULT ? heroImageUrl : undefined}
                  bucket="product-images"
                  folder="hero"
                  maxSize={5}
                  aspectRatio="landscape"
                />
              </div>
            )}
          </div>
          <div className="md:w-1/2 relative rounded-lg shadow-xl overflow-hidden bg-white/10 p-1">
            <ImageWithFallback 
              src={heroImageUrl} 
              alt="Recovery Equipment" 
              className="rounded-lg w-full h-auto object-cover"
              fallbackSrc={imageUrls.HERO_DEFAULT}
              disableCacheBusting={false}
              type="hero"
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                <p className="text-gray-500">Loading image...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
