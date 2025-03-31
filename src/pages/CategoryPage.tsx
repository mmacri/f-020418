
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { getCategoryBySlug } from '@/services/categoryService';
import { getProductsByCategory } from '@/services/products/productApi';
import { Product } from '@/services/products/types';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { generateCategoryBreadcrumbs } from '@/lib/category-utils';
import { Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageWithFallback } from '@/lib/images';
import { imageUrls } from '@/lib/constants';
import { supabase } from '@/integrations/supabase/client';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!categorySlug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get category data
        const categoryData = await getCategoryBySlug(categorySlug);
        setCategory(categoryData);
        
        if (categoryData) {
          // Generate breadcrumbs
          const crumbs = generateCategoryBreadcrumbs(categoryData);
          setBreadcrumbs(crumbs);
          
          // Get products for this category
          const categoryProducts = await getProductsByCategory(categorySlug);
          setProducts(categoryProducts);
          
          // Track page view for analytics
          try {
            const { data: analyticsData } = await supabase
              .from('analytics_events')
              .insert({
                event_type: 'category_view',
                page_url: window.location.href,
                data: {
                  categoryId: categoryData.id,
                  categoryName: categoryData.name,
                  timestamp: Date.now()
                }
              })
              .select();
              
            console.log('Category view tracked:', analyticsData);
          } catch (analyticsError) {
            console.error('Error tracking category view:', analyticsError);
          }
        }
      } catch (err) {
        console.error('Error loading category data:', err);
        setError('Failed to load category. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [categorySlug]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading category information...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !category) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <p className="mt-2">The category you're looking for doesn't exist or an error occurred.</p>
          <p className="text-red-500">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-2">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <ImageWithFallback
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover"
            fallbackSrc={imageUrls.CATEGORY_DEFAULT}
            type="category"
          />
        </div>
        <div className="relative container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            {category.description || `Browse our selection of ${category.name.toLowerCase()} to find the perfect recovery tools for your needs.`}
          </p>
        </div>
      </div>
      
      {/* Subcategories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Browse {category.name} by Subcategory</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {category.subcategories.map((subcategory: any) => (
                <Card key={subcategory.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <Link 
                      to={`/categories/${category.slug}/${subcategory.slug}`}
                      className="block"
                    >
                      <div className="h-40 relative overflow-hidden">
                        <ImageWithFallback
                          src={subcategory.imageUrl}
                          alt={subcategory.name}
                          className="w-full h-full object-cover"
                          fallbackSrc={imageUrls.CATEGORY_DEFAULT}
                          type="category"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                          <div className="p-4 text-white">
                            <h3 className="text-xl font-bold">{subcategory.name}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          {subcategory.description?.substring(0, 60) || `Explore our ${subcategory.name} collection`}
                          {subcategory.description?.length > 60 ? '...' : ''}
                        </p>
                        <ChevronRight className="h-5 w-5 text-indigo-600" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">All {category.name} Products</h2>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                There are currently no products in this category.
              </p>
              <Button asChild>
                <Link to="/categories">Browse Other Categories</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default CategoryPage;
