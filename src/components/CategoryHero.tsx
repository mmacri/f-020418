
import React from 'react';
import { getCategoryName } from '@/lib/product-utils';

interface CategoryHeroProps {
  categorySlug: string;
  description?: string;
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ categorySlug, description }) => {
  const categoryName = getCategoryName(categorySlug);
  
  return (
    <section className="hero-bg text-white py-12">
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
    </section>
  );
};

export default CategoryHero;
