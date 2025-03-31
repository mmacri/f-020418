
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Grid3X3, List } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Product } from '@/services/products/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<string>('featured');
  
  // Group products by subcategory
  const getProductsBySubcategory = (subcategorySlug: string) => {
    return products.filter(product => product.subcategory === subcategorySlug);
  };
  
  // Get products without subcategory
  const productsWithoutSubcategory = products.filter(product => !product.subcategory);
  
  // Determine if we should show subcategories or just products
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
  const shouldGroupBySubcategory = showSubcategories && hasSubcategories && !searchTerm;
  
  // Sort products based on selected order
  const sortProducts = (productsToSort: Product[]) => {
    switch(sortOrder) {
      case 'price-asc':
        return [...productsToSort].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...productsToSort].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...productsToSort].sort((a, b) => b.rating - a.rating);
      case 'newest':
        return [...productsToSort].sort((a, b) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
      case 'featured':
      default:
        return [...productsToSort].sort((a, b) => 
          (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0)
        );
    }
  };
  
  if (products.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No products available in this category.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {!shouldGroupBySubcategory && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-medium">{products.length} Products</h2>
          <div className="flex items-center gap-4">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-md">
              <Toggle 
                pressed={viewMode === 'grid'} 
                onPressedChange={() => setViewMode('grid')}
                aria-label="Grid view"
                className="px-3"
              >
                <Grid3X3 className="h-4 w-4" />
              </Toggle>
              <Toggle 
                pressed={viewMode === 'list'} 
                onPressedChange={() => setViewMode('list')}
                aria-label="List view"
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Toggle>
            </div>
          </div>
        </div>
      )}
      
      {shouldGroupBySubcategory ? (
        <>
          {/* Products without subcategory */}
          {productsWithoutSubcategory.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">General {category.name}</h3>
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
              }>
                {sortProducts(productsWithoutSubcategory).map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    layout={viewMode === 'list' ? 'horizontal' : 'vertical'}
                  />
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
                
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
                }>
                  {sortProducts(subcategoryProducts).slice(0, 3).map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      layout={viewMode === 'list' ? 'horizontal' : 'vertical'}
                    />
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
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-4"
        }>
          {sortProducts(products).map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              layout={viewMode === 'list' ? 'horizontal' : 'vertical'}
            />
          ))}
        </div>
      )}
      
      {!searchTerm && !shouldGroupBySubcategory && (
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
