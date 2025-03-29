
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { localStorageKeys } from '@/lib/constants';

const DEFAULT_HERO_IMAGE = "https://static.vecteezy.com/system/resources/previews/021/573/353/non_2x/arm-muscle-silhouette-logo-biceps-icon-free-vector.jpg";

const HeroSection: React.FC = () => {
  const [heroImageUrl, setHeroImageUrl] = useState<string>(DEFAULT_HERO_IMAGE);
  
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
                className="bg-white text-indigo-600 hover:bg-gray-100"
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
                className="bg-transparent border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/blog">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src={heroImageUrl} 
              alt="Recovery Equipment" 
              className="rounded-lg shadow-xl w-full h-auto"
              onError={(e) => {
                // Fallback to default image if the custom one fails to load
                const target = e.target as HTMLImageElement;
                target.src = DEFAULT_HERO_IMAGE;
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
