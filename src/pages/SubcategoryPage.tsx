
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import SubcategoryHero from '@/components/SubcategoryHero';
import { getSubcategoryBySlug } from '@/services/categoryService';
import { getProductsBySubcategory } from '@/lib/product-utils';
import { generateCategoryBreadcrumbs } from '@/lib/category-utils';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import { Loader2, Filter, ArrowUpDown } from 'lucide-react';
import { trackAffiliateClick } from '@/lib/analytics-utils';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SubcategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams<{ categorySlug: string; subcategorySlug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [subcategoryData, setSubcategoryData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchData = async () => {
      if (!categorySlug || !subcategorySlug) return;
      
      setIsLoading(true);
      try {
        // Get subcategory data
        const data = await getSubcategoryBySlug(categorySlug, subcategorySlug);
        setSubcategoryData(data);
        
        if (data && data.category && data.subcategory) {
          // Generate breadcrumbs
          const crumbs = generateCategoryBreadcrumbs(data.category, data.subcategory);
          setBreadcrumbs(crumbs);
          
          // Get products for this subcategory
          const subcategoryProducts = await getProductsBySubcategory(categorySlug, subcategorySlug);
          setProducts(subcategoryProducts);
          
          // Track page view for analytics
          try {
            // Record analytics for subcategory page view
            const { data: analyticsData } = await supabase
              .from('analytics_events')
              .insert({
                event_type: 'subcategory_view',
                page_url: window.location.href,
                data: {
                  categoryId: data.category.id,
                  categoryName: data.category.name,
                  subcategoryId: data.subcategory.id,
                  subcategoryName: data.subcategory.name,
                  timestamp: Date.now()
                }
              })
              .select();
              
            console.log('Subcategory view tracked:', analyticsData);
          } catch (analyticsError) {
            console.error('Error tracking subcategory view:', analyticsError);
          }
        }
      } catch (error) {
        console.error('Error loading subcategory data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [categorySlug, subcategorySlug]);

  // Handle affiliate link clicks
  const handleProductClick = (product: any) => {
    if (product.affiliateUrl) {
      trackAffiliateClick(
        product.id,
        product.name,
        product.affiliateUrl,
        `subcategory_${subcategorySlug}`,
        product.asin
      );
    }
  };

  // Sort products based on the selected option
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0; // Default sorting (relevance)
    }
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading subcategory information...</p>
        </div>
      </MainLayout>
    );
  }

  if (!subcategoryData || !subcategoryData.category || !subcategoryData.subcategory) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Subcategory not found</h1>
          <p className="mt-2">The subcategory you're looking for doesn't exist.</p>
        </div>
      </MainLayout>
    );
  }

  const { category, subcategory } = subcategoryData;

  return (
    <MainLayout>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-2">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>
      
      {/* Subcategory Hero */}
      <SubcategoryHero 
        categoryName={category.name}
        subcategoryName={subcategory.name}
        description={subcategory.description}
        backgroundImage={subcategory.imageUrl}
        subcategory={subcategory}
      />
      
      {/* Category description content */}
      {subcategory.content && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="buying-guide">Buying Guide</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: subcategory.content }} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="buying-guide" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <CardDescription className="mb-4">
                      How to choose the best {subcategory.name} for your needs
                    </CardDescription>
                    <div className="prose max-w-none">
                      <p>Buying guide content would appear here if available.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="faq" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <CardDescription className="mb-4">
                      Frequently asked questions about {subcategory.name}
                    </CardDescription>
                    <div className="prose max-w-none">
                      <p>FAQ content would appear here if available.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      )}
      
      {/* Products Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-3xl font-bold mb-4 md:mb-0">
              {subcategory.name} Products
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex border rounded-md overflow-hidden">
                <button 
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'bg-white'}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <Filter className="h-4 w-4" />
                </button>
                <button 
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-white'}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {sortedProducts.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {sortedProducts.map(product => (
                viewMode === 'grid' ? (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => handleProductClick(product)}
                  />
                ) : (
                  <div key={product.id} className="flex border rounded-lg overflow-hidden">
                    <div className="w-1/3">
                      <img 
                        src={product.imageUrl || '/placeholder.svg'} 
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <div className="flex items-center mb-2">
                        <div className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">
                          {product.rating ? `${product.rating}/5` : 'Not rated'}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{product.description?.substring(0, 100)}...</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">
                          {product.price ? `$${product.price.toFixed(2)}` : 'Check price'}
                        </span>
                        <button 
                          onClick={() => handleProductClick(product)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found in this subcategory.</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default SubcategoryPage;
