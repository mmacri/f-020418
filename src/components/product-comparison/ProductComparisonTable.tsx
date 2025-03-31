
import React from 'react';
import { Product } from '@/services/products/types';
import { 
  ProductTableHeader,
  ProductActionsRow,
  ProductRatingRow,
  ProductPriceRow,
  ProductFeaturesRow,
  ProductSpecsRows,
  ProductProsRow
} from './';
import { formatPrice } from '@/lib/products/formatters';

interface ProductComparisonTableProps {
  products: Product[];
  highlightBestProduct?: boolean;
  customizeAllowed?: boolean;
}

/**
 * Renders a comparison table for multiple products
 */
const ProductComparisonTable = ({ 
  products, 
  highlightBestProduct = true,
  customizeAllowed = true 
}: ProductComparisonTableProps) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No products to compare.</p>
      </div>
    );
  }

  // Get common specification keys across all products for comparison
  const getCommonSpecificationKeys = () => {
    const allKeys = new Set<string>();
    
    // First, collect all possible keys
    products.forEach(product => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach(key => allKeys.add(key));
      }
    });
    
    // Return as array
    return Array.from(allKeys);
  };

  const specificationKeys = getCommonSpecificationKeys();
  const bestProductId = highlightBestProduct && products.length > 0 ? String(products[0].id) : null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <ProductTableHeader 
          products={products} 
          bestProductId={bestProductId} 
        />
        
        <tbody>
          <ProductActionsRow 
            products={products} 
            bestProductId={bestProductId} 
          />
          
          <ProductRatingRow 
            products={products} 
            bestProductId={bestProductId} 
          />
          
          <ProductPriceRow 
            products={products} 
            bestProductId={bestProductId} 
          />
          
          <ProductFeaturesRow 
            products={products} 
            bestProductId={bestProductId} 
          />
          
          <ProductSpecsRows 
            products={products}
            visibleSpecKeys={specificationKeys} 
            bestProductId={bestProductId} 
          />
          
          <ProductProsRow 
            products={products} 
            bestProductId={bestProductId} 
          />
        </tbody>
      </table>
    </div>
  );
};

export default ProductComparisonTable;
