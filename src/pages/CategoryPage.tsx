
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import CategoryHero from '@/components/CategoryHero';
import { getCategoryBySlug } from '@/services/categoryService';
import { getProductsByCategory } from '@/lib/product-utils';
import { generateCategoryBreadcrumbs } from '@/lib/category-utils';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackAffiliateClick } from '@/lib/analytics-utils';
import { supabase } from '@/integrations/supabase/client';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!categorySlug) return;
      
      setIsLoading(true);
      try {
        // Get category data
        const data = await getCategoryBySlug(categorySlug);
        setCategoryData(data);
        
        if (data) {
          // Generate breadcrumbs
          const crumbs = generateCategoryBreadcrumbs(data);
          setBreadcrumbs(crumbs);
          
          // Get products for this category
          const categoryProducts = await getProductsByCategory(categorySlug);
          setProducts(categoryProducts);
          
          // Get featured products (highest rated)
          const featured = [...categoryProducts]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3);
          setFeaturedProducts(featured);
          
          // Track page view for analytics
          try {
            // Record analytics for category page view
            const { data: analyticsData } = await supabase
              .from('analytics_events')
              .insert({
                event_type: 'category_view',
                page_url: window.location.href,
                data: {
                  categoryId: data.id,
                  categoryName: data.name,
                  timestamp: Date.now()
                }
              })
              .select();
              
            console.log('Category view tracked:', analyticsData);
          } catch (analyticsError) {
            console.error('Error tracking category view:', analyticsError);
          }
        }
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [categorySlug]);

  // Handle affiliate link clicks
  const handleProductClick = (product: any) => {
    if (product.affiliateUrl) {
      trackAffiliateClick(
        product.id,
        product.name,
        product.affiliateUrl,
        `category_${categorySlug}`,
        product.asin
      );
    }
  };

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

  if (!categoryData) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <p className="mt-2">The category you're looking for doesn't exist.</p>
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
      
      {/* Category Hero */}
      <CategoryHero 
        categorySlug={categorySlug || ''}
        description={categoryData.description}
        backgroundImage={categoryData.imageUrl}
        subcategories={categoryData.subcategories || []}
        category={categoryData}
      />
      
      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2 text-center">
              Featured {categoryData.name}
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Our top-rated {categoryData.name.toLowerCase()} recommended by experts and loved by customers
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  featured={true} 
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Subcategories Section */}
      {categoryData.subcategories && categoryData.subcategories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2 text-center">
              Browse {categoryData.name} by Category
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Find the perfect {categoryData.name.toLowerCase()} for your specific needs
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryData.subcategories.map(subcategory => (
                <Card key={subcategory.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <Link 
                      to={`/categories/${categorySlug}/${subcategory.slug}`}
                      className="block"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={subcategory.imageUrl || '/placeholder.svg'} 
                          alt={subcategory.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <h3 className="text-white text-xl font-bold">{subcategory.name}</h3>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {subcategory.description || `Explore our selection of ${subcategory.name} products.`}
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          View Products <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* All Products Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            All {categoryData.name} Products
          </h2>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Category Comparison CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Compare {categoryData.name}
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Not sure which {categoryData.name.toLowerCase()} is right for you? Use our comparison tool to see features side by side.
          </p>
          <Button asChild size="lg">
            <Link to={`/product-comparison/${categorySlug}`}>
              Compare Top {categoryData.name}
            </Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default CategoryPage;
