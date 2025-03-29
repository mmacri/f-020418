
import React from 'react';
import { Minus } from 'lucide-react';
import { Product } from '@/services/productService';
import ProductComparisonRow from './ProductComparisonRow';

interface ProductSpecsRowsProps {
  products: Product[];
  visibleSpecKeys: string[];
  bestProductId: number | null;
}

const ProductSpecsRows: React.FC<ProductSpecsRowsProps> = ({ 
  products, 
  visibleSpecKeys, 
  bestProductId 
}) => {
  return (
    <>
      {visibleSpecKeys.map(key => (
        <ProductComparisonRow 
          key={key}
          label={key}
          products={products}
          cellRenderer={(product) => (
            product.specifications && product.specifications[key] 
              ? product.specifications[key] 
              : <Minus className="mx-auto h-4 w-4 text-gray-300" />
          )}
          bestProductId={bestProductId}
        />
      ))}
    </>
  );
};

export default ProductSpecsRows;
