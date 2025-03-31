
import React from 'react';
import { ImageWithFallback } from '@/lib/images/ImageWithFallback';
import { imageUrls } from '@/lib/constants';

interface SubcategoryHeroProps {
  categoryName: string;
  subcategoryName: string;
  description?: string;
  backgroundImage?: string;
  subcategory?: any;
}

const SubcategoryHero: React.FC<SubcategoryHeroProps> = ({ 
  categoryName, 
  subcategoryName, 
  description, 
  backgroundImage,
  subcategory 
}) => {
  // Use backgroundImage prop first, then check subcategory data for image, or fall back to parent category's image
  const imageUrl = backgroundImage || (subcategory?.imageUrl) || imageUrls.CATEGORY_DEFAULT;
  
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
          alt={`${subcategoryName} subcategory background`}
          fallbackSrc={imageUrls.CATEGORY_DEFAULT}
          className="w-full h-full object-cover"
          type="category"
        />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">
            {subcategoryName}: The Best {categoryName} for Recovery
          </h1>
          <p className="text-lg mb-6 text-white/90 drop-shadow">
            {description || subcategory?.description || `Comprehensive guide to the top ${subcategoryName.toLowerCase()} products for improving flexibility, mobility, and aiding recovery`}
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

export default SubcategoryHero;
