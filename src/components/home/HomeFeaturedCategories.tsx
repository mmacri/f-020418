
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { localStorageKeys } from '@/lib/constants';

const LOCAL_FALLBACK_IMAGE = "/placeholder.svg";

interface HomeFeaturedCategoriesProps {
  categories: any[];
}

const HomeFeaturedCategories: React.FC<HomeFeaturedCategoriesProps> = ({ categories }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Top Recovery Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.slice(0, 4).map(category => (
            <Link 
              key={category.id} 
              to={`/categories/${category.slug}`}
              className="group block overflow-hidden rounded-lg shadow-md transition-all hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={category.imageUrl || `https://ext.same-assets.com/30303031/foam-roller-category.jpg`} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const useLocalFallback = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
                    target.src = useLocalFallback ? LOCAL_FALLBACK_IMAGE : `https://ext.same-assets.com/30303031/foam-roller-category.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white text-xl font-bold">{category.name}</h3>
                    <div className="flex items-center text-white/80 mt-1 text-sm">
                      View Collection
                      <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button variant="outline" asChild>
            <Link to="/categories">
              View All Categories
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeFeaturedCategories;
