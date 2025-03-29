
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  subcategories?: any[];
}

interface CategoriesSectionProps {
  categories: Category[];
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Browse Recovery Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <Card key={category.id} className="overflow-hidden hover:shadow-xl transition-shadow border shadow-md">
              <CardContent className="p-0">
                <Link to={`/categories/${category.slug}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={category.imageUrl || 'https://ext.same-assets.com/30303033/bands-category.jpg'} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white text-xl font-bold">{category.name}</h3>
                    </div>
                  </div>
                  <div className="p-4 bg-card text-card-foreground">
                    <p className="text-muted-foreground text-sm mb-3">
                      {category.description || `Browse our selection of ${category.name.toLowerCase()}`}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-primary font-medium">
                        {category.subcategories?.length || 0} Subcategories
                      </span>
                      <div className="text-primary flex items-center">
                        View Products <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
