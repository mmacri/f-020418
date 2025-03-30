
import React from 'react';
import { getCategoryName } from '@/lib/product-utils';
import { ImageWithFallback } from '@/lib/images';
import { imageUrls } from '@/lib/constants';

export interface CategoryHeroProps {
  categorySlug?: string;
  description?: string;
  backgroundImage?: string;
  category?: any;
  name?: string;
  subcategories?: any[];
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ 
  categorySlug, 
  description, 
  backgroundImage,
  category,
  name,
  subcategories
}) => {
  const categoryName = name || (category?.name) || (categorySlug ? getCategoryName(categorySlug) : '');
  const imageUrl = backgroundImage || category?.imageUrl || imageUrls.CATEGORY_DEFAULT;
  
  return (
    <section 
      className="hero-bg text-white py-16 relative min-h-[260px] flex items-center" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.75))`,
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">
            The Best {categoryName} for Recovery and Mobility
          </h1>
          <p className="text-lg mb-6 text-white/90 drop-shadow">
            {description || category?.description || `Comprehensive guide to the top ${categoryName.toLowerCase()} for improving flexibility, mobility, and aiding recovery`}
          </p>
          <div className="bg-indigo-800/90 backdrop-blur inline-block px-4 py-2 rounded-md shadow-md">
            <p className="text-sm font-medium text-white">
              <span className="mr-1">ⓘ</span> Affiliate Disclosure: We may earn commissions from qualifying purchases
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryHero;
