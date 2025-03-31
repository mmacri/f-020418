
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/lib/images';
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
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <ImageWithFallback
          src={backgroundImage}
          alt={subcategoryName}
          className="w-full h-full object-cover"
          fallbackSrc={imageUrls.CATEGORY_DEFAULT}
          type="category"
        />
      </div>
      <div className="relative container mx-auto px-4 py-16">
        <div className="flex flex-col items-start">
          <div className="mb-2 text-sm font-medium opacity-80">
            <span>{categoryName}</span> / <span>{subcategoryName}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{subcategoryName}</h1>
          <p className="text-xl opacity-90 max-w-2xl mb-6">
            {description || `Browse our selection of ${subcategoryName.toLowerCase()} products from the ${categoryName.toLowerCase()} category.`}
          </p>
          {subcategory?.attributes?.ctaUrl && (
            <Button asChild className="bg-white text-indigo-600 hover:bg-gray-100">
              <Link to={subcategory.attributes.ctaUrl}>
                {subcategory.attributes.ctaText || 'Learn More'} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubcategoryHero;
