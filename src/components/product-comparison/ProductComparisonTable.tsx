
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
  const bestProduct = highlightBestProduct ? products[0] : null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <ProductTableHeader 
          products={products} 
          bestProduct={bestProduct} 
        />
        
        <tbody>
          <ProductActionsRow 
            products={products} 
            formatPrice={formatPrice} 
          />
          
          <ProductRatingRow 
            products={products} 
            bestProduct={bestProduct} 
          />
          
          <ProductPriceRow 
            products={products} 
            formatPrice={formatPrice} 
            bestProduct={bestProduct} 
          />
          
          <ProductFeaturesRow 
            products={products} 
            bestProduct={bestProduct} 
          />
          
          <ProductSpecsRows 
            products={products}
            specificationKeys={specificationKeys} 
            bestProduct={bestProduct} 
          />
          
          <ProductProsRow 
            products={products} 
            bestProduct={bestProduct} 
          />
        </tbody>
      </table>
    </div>
  );
};

export default ProductComparisonTable;
