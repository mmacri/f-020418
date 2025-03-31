
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getNavigationCategories } from '@/services/categoryService';
import { getProducts } from '@/services/productService';
import { ImageWithFallback } from '@/lib/images';
import { imageUrls } from '@/lib/constants';
import { Product } from '@/services/products/types';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';

const AllCategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get all categories
        const categoriesData = await getNavigationCategories();
        setCategories(categoriesData);
        
        // Get all products
        const allProducts = await getProducts();
        
        // Group products by category
        const productsByCategory: Record<string, Product[]> = {};
        
        allProducts.forEach(product => {
          if (product.categoryId) {
            if (!productsByCategory[product.categoryId]) {
              productsByCategory[product.categoryId] = [];
            }
            productsByCategory[product.categoryId].push(product);
          }
        });
        
        setProducts(productsByCategory);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'All Categories', url: '/categories' }
  ];
  
  return (
    <MainLayout>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-2">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Browse All Categories</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Explore our complete collection of recovery equipment, organized by category to help you find exactly what you need.
          </p>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {categories.map(category => (
                <div key={category.id} className="space-y-8">
                  <div className="border-b pb-2 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <Link 
                      to={`/categories/${category.slug}`} 
                      className="text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      View All {category.name}
                      <ChevronRight className="ml-1 h-5 w-5" />
                    </Link>
                  </div>
                  
                  {/* Subcategories */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {category.subcategories.map((subcategory: any) => (
                        <Card key={subcategory.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <CardContent className="p-0">
                            <Link to={`/categories/${category.slug}/${subcategory.slug}`}>
                              <div className="h-32 relative">
                                <ImageWithFallback 
                                  src={subcategory.imageUrl}
                                  alt={subcategory.name}
                                  className="w-full h-full object-cover"
                                  fallbackSrc={imageUrls.CATEGORY_DEFAULT}
                                  type="category"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                  <h3 className="text-white font-bold p-3">{subcategory.name}</h3>
                                </div>
                              </div>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {/* Products */}
                  <div>
                    <h3 className="text-xl font-medium mb-4">Featured {category.name}</h3>
                    {products[category.id] && products[category.id].length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products[category.id].slice(0, 4).map(product => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic py-4">No products available in this category.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default AllCategoriesPage;
