
import React from 'react';
import { getCategoryName } from '@/lib/product-utils';
import { useImageWithFallback } from '@/lib/image-utils';

interface CategoryHeroProps {
  categorySlug: string;
  description?: string;
  backgroundImage?: string;
}

const DEFAULT_BACKGROUND_IMAGE = "https://ext.same-assets.com/1001010126/massage-gun-category.jpg";

const CategoryHero: React.FC<CategoryHeroProps> = ({ 
  categorySlug, 
  description, 
  backgroundImage 
}) => {
  const categoryName = getCategoryName(categorySlug);
  const { imageUrl, handleImageError } = useImageWithFallback(backgroundImage || DEFAULT_BACKGROUND_IMAGE, {
    defaultImage: DEFAULT_BACKGROUND_IMAGE,
    localFallbackImage: "/placeholder.svg"
  });
  
  return (
    <section 
      className="hero-bg text-white py-12" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('${imageUrl}')`,
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
        src={imageUrl} 
        alt="" 
        className="hidden" 
        onError={handleImageError}
      />
    </section>
  );
};

export default CategoryHero;
