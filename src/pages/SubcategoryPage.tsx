
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import SubcategoryHero from '@/components/SubcategoryHero';
import { getSubcategoryBySlug } from '@/services/categoryService';
import { getProductsBySubcategory } from '@/lib/product-utils';
import { generateCategoryBreadcrumbs } from '@/lib/category-utils';
import Breadcrumbs from '@/components/Breadcrumbs';
import CategoryProductSection from '@/components/CategoryProductSection';
import { Loader2 } from 'lucide-react';
import { trackAffiliateClick } from '@/lib/analytics-utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Card,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SubcategoryPage = () => {
  const { categorySlug, subSlug } = useParams<{ categorySlug: string; subSlug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [subcategoryData, setSubcategoryData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!categorySlug || !subSlug) return;
      
      setIsLoading(true);
      try {
        console.log(`Fetching subcategory: ${categorySlug}/${subSlug}`);
        
        // Get subcategory data
        const data = await getSubcategoryBySlug(categorySlug, subSlug);
        console.log('Subcategory data:', data);
        setSubcategoryData(data);
        
        if (data && data.category && data.subcategory) {
          // Generate breadcrumbs
          const crumbs = generateCategoryBreadcrumbs(data.category, data.subcategory);
          setBreadcrumbs(crumbs);
          
          // Get products for this subcategory
          const subcategoryProducts = await getProductsBySubcategory(categorySlug, subSlug);
          console.log('Products for subcategory:', subcategoryProducts);
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
        } else {
          toast.error('Subcategory not found');
        }
      } catch (error) {
        console.error('Error loading subcategory data:', error);
        toast.error('Failed to load subcategory data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [categorySlug, subSlug]);

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
          {products.length > 0 ? (
            <CategoryProductSection
              category={category}
              products={products}
              showSubcategories={false}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found in this subcategory.</p>
              <p className="text-sm text-gray-400 mt-2">Try browsing other subcategories or contact us if you need help finding specific products.</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default SubcategoryPage;
