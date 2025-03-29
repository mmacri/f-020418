
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { localStorageKeys, imageUrls } from '@/lib/constants';
import { ImageWithFallback } from '@/lib/image-utils';

const HeroSection: React.FC = () => {
  const [heroImageUrl, setHeroImageUrl] = useState<string>(imageUrls.HERO_DEFAULT);
  
  useEffect(() => {
    // Try to load the hero image from localStorage
    const savedImage = localStorage.getItem(localStorageKeys.HERO_IMAGE);
    if (savedImage) {
      setHeroImageUrl(savedImage);
    }
  }, []);

  return (
    <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24">
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
                className="bg-white text-indigo-600 hover:bg-gray-100 font-medium"
                asChild
              >
                <Link to="/categories/massage-guns">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Shop Recovery Gear
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white/10 font-medium"
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
            <ImageWithFallback 
              src={heroImageUrl} 
              alt="Recovery Equipment" 
              className="rounded-lg w-full h-auto"
              fallbackSrc={imageUrls.HERO_DEFAULT}
              disableCacheBusting={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
