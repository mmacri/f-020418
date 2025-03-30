
import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '@/services/productService';
import ProductComparisonRow from './ProductComparisonRow';

interface ProductRatingRowProps {
  products: Product[];
  bestProductId: string | number | null;
}

const ProductRatingRow: React.FC<ProductRatingRowProps> = ({ products, bestProductId }) => {
  return (
    <ProductComparisonRow 
      label="Rating"
      products={products}
      cellRenderer={(product) => (
        <div className="flex items-center justify-center">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'fill-gray-200'}`} 
              />
            ))}
          </div>
          <span className="ml-1 text-sm">({product.reviewCount})</span>
        </div>
      )}
      bestProductId={bestProductId}
    />
  );
};

export default ProductRatingRow;
