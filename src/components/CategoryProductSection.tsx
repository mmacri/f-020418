
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Product } from '@/services/products/types';

interface CategoryProductSectionProps {
  category: any;
  products: Product[];
  showSubcategories?: boolean;
  searchTerm?: string;
}

const CategoryProductSection: React.FC<CategoryProductSectionProps> = ({
  category,
  products,
  showSubcategories = true,
  searchTerm = ''
}) => {
  // Group products by subcategory
  const getProductsBySubcategory = (subcategorySlug: string) => {
    return products.filter(product => product.subcategory === subcategorySlug);
  };
  
  // Get products without subcategory
  const productsWithoutSubcategory = products.filter(product => !product.subcategory);
  
  // Determine if we should show subcategories or just products
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
  const shouldGroupBySubcategory = showSubcategories && hasSubcategories && !searchTerm;
  
  if (products.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No products available in this category.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {shouldGroupBySubcategory ? (
        <>
          {/* Products without subcategory */}
          {productsWithoutSubcategory.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">General {category.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productsWithoutSubcategory.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
          
          {/* Products grouped by subcategory */}
          {category.subcategories.map(subcategory => {
            const subcategoryProducts = getProductsBySubcategory(subcategory.slug);
            
            if (subcategoryProducts.length === 0) return null;
            
            return (
              <div key={subcategory.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{subcategory.name}</h3>
                  <Button variant="ghost" size="sm" asChild>
                    <Link 
                      to={`/categories/${category.slug}/${subcategory.slug}`}
                      className="flex items-center text-indigo-600"
                    >
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subcategoryProducts.slice(0, 3).map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {subcategoryProducts.length > 3 && (
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" asChild>
                      <Link to={`/categories/${category.slug}/${subcategory.slug}`}>
                        See all {subcategoryProducts.length} products
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </>
      ) : (
        // Show all products without subcategory grouping
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      
      {!searchTerm && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" asChild>
            <Link to={`/categories/${category.slug}`}>
              View All {category.name}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryProductSection;
