
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import ProductComparisonTable from '@/components/ProductComparisonTable';
import { useProductComparison } from '@/hooks/useProductComparison';
import { 
  EmptyComparisonState, 
  ComparisonLoadingState, 
  ComparisonPageHeader 
} from '@/components/product-comparison';

const ProductComparisonPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const productIds = searchParams.get('ids')?.split(',') || [];
  
  const { products, isLoading, categoryName } = useProductComparison({ 
    category, 
    productIds 
  });
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <ComparisonPageHeader categoryName={categoryName} />
        
        {isLoading ? (
          <ComparisonLoadingState />
        ) : products.length > 1 ? (
          <ProductComparisonTable products={products} highlightBestProduct={true} />
        ) : (
          <EmptyComparisonState onGoBack={() => window.history.back()} />
        )}
      </div>
    </MainLayout>
  );
};

export default ProductComparisonPage;
