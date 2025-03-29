
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import ProductComparisonTable from '@/components/ProductComparisonTable';
import { Product, getProducts } from '@/services/productService';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getProductsByCategory } from '@/lib/product-utils';
import { getCategoryBySlug } from '@/services/categoryService';

const ProductComparisonPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const productIds = searchParams.get('ids')?.split(',') || [];
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let productsToCompare: Product[] = [];
        
        // If productIds are provided in the URL
        if (productIds.length > 0) {
          const allProducts = await getProducts();
          productsToCompare = allProducts.filter(p => 
            productIds.includes(p.id.toString()) || productIds.includes(p.slug)
          );
        } 
        // If category is provided
        else if (category) {
          const categoryData = await getCategoryBySlug(category);
          if (categoryData) {
            setCategoryName(categoryData.name);
            const categoryProducts = await getProductsByCategory(category);
            // Sort by rating to show best products first
            productsToCompare = (categoryProducts as Product[])
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5); // Limit to top 5
          }
        }
        // Default fallback - just get some products
        else {
          const allProducts = await getProducts();
          productsToCompare = allProducts
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
        }
        
        setProducts(productsToCompare);
      } catch (error) {
        console.error('Error fetching products for comparison:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [category, productIds]);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">
          {categoryName ? `${categoryName} Comparison` : 'Product Comparison'}
        </h1>
        <p className="text-gray-600 mb-8">
          Compare features, specifications, and prices of the top products to find the best one for your needs.
        </p>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : products.length > 1 ? (
          <ProductComparisonTable products={products} highlightBestProduct={true} />
        ) : (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">Not enough products to compare</h2>
            <p className="text-gray-600 mb-4">Please select at least two products to compare</p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductComparisonPage;
