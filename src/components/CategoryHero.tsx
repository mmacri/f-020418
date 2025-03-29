
import React from 'react';
import { getCategoryName } from '@/lib/product-utils';
import { ImageWithFallback } from '@/lib/images';
import { imageUrls } from '@/lib/constants';

interface CategoryHeroProps {
  categorySlug: string;
  description?: string;
  backgroundImage?: string;
  category?: any;
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ 
  categorySlug, 
  description, 
  backgroundImage,
  category
}) => {
  const categoryName = category?.name || getCategoryName(categorySlug);
  const imageUrl = backgroundImage || category?.imageUrl || imageUrls.CATEGORY_DEFAULT;
  
  return (
    <section 
      className="hero-bg text-white py-12 relative min-h-[240px]" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7))`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background image as separate div for better control */}
      <div 
        className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat overflow-hidden"
      >
        <ImageWithFallback
          src={imageUrl}
          alt={`${categoryName} category background`}
          fallbackSrc={imageUrls.DEFAULT_FALLBACK}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            The Best {categoryName} for Recovery and Mobility
          </h1>
          <p className="text-lg mb-4">
            {description || category?.description || `Comprehensive guide to the top ${categoryName.toLowerCase()} for improving flexibility, mobility, and aiding recovery`}
          </p>
          <p className="text-sm bg-indigo-700 inline-block px-3 py-1 rounded-full">
            <span className="mr-1">ⓘ</span> Affiliate Disclosure: We may earn commissions from qualifying purchases
          </p>
        </div>
      </div>
    </section>
  );
};

export default CategoryHero;
