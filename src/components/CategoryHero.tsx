
import React, { useState, useEffect } from 'react';
import { getCategoryName } from '@/lib/product-utils';
import { localStorageKeys } from '@/lib/constants';

interface CategoryHeroProps {
  categorySlug: string;
  description?: string;
  backgroundImage?: string;
}

const DEFAULT_BACKGROUND_IMAGE = "https://ext.same-assets.com/1001010126/massage-gun-category.jpg";
const LOCAL_FALLBACK_IMAGE = "/placeholder.svg";

const CategoryHero: React.FC<CategoryHeroProps> = ({ 
  categorySlug, 
  description, 
  backgroundImage 
}) => {
  const categoryName = getCategoryName(categorySlug);
  const [bgImage, setBgImage] = useState<string>(backgroundImage || DEFAULT_BACKGROUND_IMAGE);
  const [useLocalFallback, setUseLocalFallback] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if we should use local fallback
    const useLocal = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
    setUseLocalFallback(useLocal);
    
    // Use provided background image or default
    setBgImage(backgroundImage || DEFAULT_BACKGROUND_IMAGE);
  }, [backgroundImage]);
  
  const handleImageError = () => {
    const fallbackImage = useLocalFallback ? LOCAL_FALLBACK_IMAGE : DEFAULT_BACKGROUND_IMAGE;
    setBgImage(fallbackImage);
    console.log("Category hero background image failed to load. Using fallback image.");
  };
  
  return (
    <section 
      className="hero-bg text-white py-12" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            The Best {categoryName} for Recovery and Mobility
          </h1>
          <p className="text-lg mb-4">
            {description || `Comprehensive guide to the top ${categoryName.toLowerCase()} for improving flexibility, mobility, and aiding recovery`}
          </p>
          <p className="text-sm bg-indigo-700 inline-block px-3 py-1 rounded-full">
            <span className="mr-1">ⓘ</span> Affiliate Disclosure: We may earn commissions from qualifying purchases
          </p>
        </div>
      </div>
      
      {/* Hidden image for preloading and error handling */}
      <img 
        src={bgImage} 
        alt="" 
        className="hidden" 
        onError={handleImageError}
      />
    </section>
  );
};

export default CategoryHero;
