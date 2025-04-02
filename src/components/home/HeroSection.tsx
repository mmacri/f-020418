
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { imageUrls } from '@/lib/constants';
import { ImageWithFallback } from '@/lib/images';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroSectionProps {
  buttonText?: string;
  buttonLink?: string;
  heroImageUrl?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  buttonText = "Shop Recovery Gear", 
  buttonLink = "/products",
  heroImageUrl = imageUrls.HERO_DEFAULT
}) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [finalImageUrl, setFinalImageUrl] = useState<string>(heroImageUrl || imageUrls.HERO_DEFAULT);
  const [loadAttempt, setLoadAttempt] = useState<number>(0);
  
  useEffect(() => {
    console.log('HeroSection mounted with image URL:', heroImageUrl);
    
    // Update the image URL when the prop changes
    if (heroImageUrl) {
      setFinalImageUrl(heroImageUrl);
    }
    
    // Listen for hero image update events
    const handleHeroImageUpdate = (e: CustomEvent) => {
      if (e.detail && e.detail.imageUrl) {
        console.log('Hero image updated via event:', e.detail.imageUrl);
        setFinalImageUrl(e.detail.imageUrl);
        setLoadAttempt(prev => prev + 1); // Force reload
      }
    };
    
    window.addEventListener('heroImageUpdated', handleHeroImageUpdate as EventListener);
    
    return () => {
      window.removeEventListener('heroImageUpdated', handleHeroImageUpdate as EventListener);
    };
  }, [heroImageUrl]);
  
  const handleImageLoad = () => {
    console.log('Hero image loaded successfully:', finalImageUrl);
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error('Hero image failed to load:', finalImageUrl);
    // Use default image on error
    if (finalImageUrl !== imageUrls.HERO_DEFAULT) {
      console.log('Falling back to default hero image');
      setFinalImageUrl(imageUrls.HERO_DEFAULT);
      setLoadAttempt(prev => prev + 1); // Force reload with fallback
    } else {
      // We're already using the fallback and it's still failing
      // Mark as loaded to remove the loading indicator
      setImageLoaded(true);
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
                <Link to={buttonLink}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {buttonText}
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
          </div>
          <div className="md:w-1/2 relative rounded-lg shadow-xl overflow-hidden bg-white/10 p-1">
            {/* Show skeleton by default, hide when image is loaded */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg z-10">
                <Skeleton className="w-full h-full absolute" />
              </div>
            )}
            <ImageWithFallback 
              key={`hero-image-${loadAttempt}`}
              src={finalImageUrl}
              alt="Recovery Equipment" 
              className={`rounded-lg w-full h-auto object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              fallbackSrc={imageUrls.HERO_DEFAULT}
              type="hero"
              onLoad={handleImageLoad}
              onError={handleImageError}
              fetchPriority="high"
              disableCacheBusting={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
