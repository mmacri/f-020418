
import React, { useState } from 'react';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { Product } from '@/services/productService';
import ProductComparisonHeader from './ProductComparisonHeader';
import ProductTableHeader from './ProductTableHeader';
import ProductPriceRow from './ProductPriceRow';
import ProductRatingRow from './ProductRatingRow';
import ProductSpecsRows from './ProductSpecsRows';
import ProductFeaturesRow from './ProductFeaturesRow';
import ProductProsRow from './ProductProsRow';
import ProductActionsRow from './ProductActionsRow';

interface ProductComparisonTableProps {
  products: Product[];
  showReviewLink?: boolean;
  highlightBestProduct?: boolean;
}

const ProductComparisonTable: React.FC<ProductComparisonTableProps> = ({ 
  products, 
  showReviewLink = true,
  highlightBestProduct = false
}) => {
  // Get common specifications keys
  const getSpecKeys = () => {
    const allKeys = new Set<string>();
    
    products.forEach(product => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach(key => allKeys.add(key));
      }
    });
    
    // Prioritize important specs
    const priorityKeys = [
      'Brand', 'Model', 'Weight', 'Dimensions', 'Power', 'Battery Life',
      'Speed Settings', 'Attachments', 'Warranty', 'Noise Level', 'Best For'
    ];
    
    const sortedKeys = [...allKeys].sort((a, b) => {
      const indexA = priorityKeys.indexOf(a);
      const indexB = priorityKeys.indexOf(b);
      
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
    
    return sortedKeys;
  };
  
  const allSpecKeys = getSpecKeys();
  const [visibleSpecs, setVisibleSpecs] = useState<Record<string, boolean>>(
    allSpecKeys.reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );
  
  const toggleSpecVisibility = (specName: string) => {
    setVisibleSpecs(prev => ({
      ...prev,
      [specName]: !prev[specName]
    }));
  };
  
  const visibleSpecKeys = allSpecKeys.filter(key => visibleSpecs[key]);
  
  // Find the best product (highest rating) and ensure ID is treated as a string for comparison
  const bestProductId = highlightBestProduct ? 
    [...products]
      .sort((a, b) => b.rating - a.rating)[0]?.id : null;

  return (
    <div className="space-y-4">
      <ProductComparisonHeader 
        products={products}
        specKeys={allSpecKeys}
        visibleSpecs={visibleSpecs}
        visibleSpecCount={visibleSpecKeys.length}
        totalSpecCount={allSpecKeys.length}
        onToggleSpec={toggleSpecVisibility}
      />
      
      <div className="overflow-x-auto">
        <Table className="border-collapse">
          <TableHeader>
            <ProductTableHeader products={products} bestProductId={bestProductId} />
          </TableHeader>
          <TableBody>
            <ProductPriceRow products={products} bestProductId={bestProductId} />
            <ProductRatingRow products={products} bestProductId={bestProductId} />
            <ProductSpecsRows 
              products={products} 
              visibleSpecKeys={visibleSpecKeys} 
              bestProductId={bestProductId} 
            />
            <ProductFeaturesRow products={products} bestProductId={bestProductId} />
            <ProductProsRow products={products} bestProductId={bestProductId} />
            <ProductActionsRow 
              products={products} 
              bestProductId={bestProductId} 
              showReviewLink={showReviewLink} 
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductComparisonTable;
