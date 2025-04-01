
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { localStorageKeys } from '@/lib/constants';
import { ImageWithFallback } from '@/lib/images';

const DEFAULT_HERO_IMAGE = "https://ext.same-assets.com/1001010126/massage-gun-category.jpg";
const LOCAL_FALLBACK_IMAGE = "/placeholder.svg";

const HomeHero: React.FC = () => {
  const [heroImage, setHeroImage] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    // Load hero image from localStorage
    const savedHeroImage = localStorage.getItem(localStorageKeys.HERO_IMAGE) || DEFAULT_HERO_IMAGE;
    console.log('HomeHero loading image from localStorage:', savedHeroImage);
    setHeroImage(savedHeroImage);
    
    // Listen for hero image updates
    const handleHeroImageUpdate = (e: CustomEvent) => {
      if (e.detail && e.detail.imageUrl) {
        console.log('HomeHero received hero image update:', e.detail.imageUrl);
        setHeroImage(e.detail.imageUrl);
        setImageLoaded(false);
      }
    };
    
    window.addEventListener('heroImageUpdated', handleHeroImageUpdate as EventListener);
    
    return () => {
      window.removeEventListener('heroImageUpdated', handleHeroImageUpdate as EventListener);
    };
  }, []);
  
  const handleHeroImageError = () => {
    // Check if we should use local fallback
    console.error('Hero image failed to load:', heroImage);
    const useLocalFallback = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
    const fallbackImage = useLocalFallback ? LOCAL_FALLBACK_IMAGE : DEFAULT_HERO_IMAGE;
    setHeroImage(fallbackImage);
    setImageLoaded(true);
  };
  
  const handleImageLoad = () => {
    console.log('HomeHero image loaded successfully:', heroImage);
    setImageLoaded(true);
  };
  
  return (
    <section className="relative bg-cover bg-center py-28" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('${heroImage}')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
      <div className="container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Recover Faster, Perform Better
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Find the best recovery equipment with our expert reviews and comparisons
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
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
            className="bg-transparent border-white text-white hover:bg-white/20"
            asChild
          >
            <Link to="/blog">
              Recovery Tips
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Hidden image for preloading with proper handlers */}
      <ImageWithFallback 
        src={heroImage} 
        alt="" 
        className="hidden" 
        onError={handleHeroImageError}
        onLoad={handleImageLoad}
        fallbackSrc={DEFAULT_HERO_IMAGE}
        type="hero"
      />
    </section>
  );
};

export default HomeHero;
