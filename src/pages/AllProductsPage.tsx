
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { getNavigationCategories } from '@/services/categoryService';
import { getProducts } from '@/services/products/productApi';
import { Product } from '@/services/products/types';
import { Loader2, ChevronDown, ChevronUp, Search } from 'lucide-react';
import CategoryProductSection from '@/components/CategoryProductSection';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';

const AllProductsPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get all categories with subcategories
        const categoriesData = await getNavigationCategories();
        setCategories(categoriesData);
        
        // Get all products
        const productsData = await getProducts();
        setProducts(productsData);
        
        // Track page view for analytics
        try {
          const { data } = await supabase
            .from('analytics_events')
            .insert({
              event_type: 'all_products_view',
              page_url: window.location.href,
              data: { timestamp: Date.now() }
            })
            .select();
            
          console.log('All products page view tracked:', data);
        } catch (analyticsError) {
          console.error('Error tracking page view:', analyticsError);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter products by search term
  const filteredProducts = products.filter(product => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.brand?.toLowerCase().includes(searchLower)
    );
  });

  // Group products by category
  const getProductsByCategory = (categoryId: string) => {
    return filteredProducts.filter(product => product.categoryId === categoryId);
  };

  // Handler for expanding/collapsing all categories
  const handleExpandAll = () => {
    if (expandedCategories.length === categories.length) {
      setExpandedCategories([]);
    } else {
      setExpandedCategories(categories.map(cat => cat.id));
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading all products...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">All Recovery Products</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Browse our complete selection of recovery equipment organized by category
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10 focus:ring-2 focus:ring-white/30"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
          </div>
        </div>
      </div>
      
      {/* Categories and Products */}
      <div className="container mx-auto px-4 py-12">
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Browse by Category</h2>
          <Button 
            variant="outline" 
            onClick={handleExpandAll}
            className="flex items-center gap-2"
          >
            {expandedCategories.length === categories.length ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>Collapse All</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>Expand All</span>
              </>
            )}
          </Button>
        </div>
        
        {/* Results summary */}
        {searchTerm && (
          <p className="mb-6 text-gray-600">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} for "{searchTerm}"
          </p>
        )}
        
        {/* Categories Accordion */}
        <Accordion
          type="multiple"
          value={expandedCategories}
          onValueChange={setExpandedCategories}
          className="space-y-4"
        >
          {categories.map(category => {
            const categoryProducts = getProductsByCategory(category.id);
            
            // Skip empty categories when searching
            if (searchTerm && categoryProducts.length === 0) return null;
            
            return (
              <AccordionItem key={category.id} value={category.id} className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-medium">{category.name}</span>
                    <span className="text-sm text-gray-500 font-normal">
                      ({categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-6">
                  <CategoryProductSection 
                    category={category} 
                    products={categoryProducts}
                    showSubcategories={true}
                    searchTerm={searchTerm}
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        
        {/* No results message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              We couldn't find any products matching your search.
            </p>
            <Button onClick={() => setSearchTerm('')}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AllProductsPage;
