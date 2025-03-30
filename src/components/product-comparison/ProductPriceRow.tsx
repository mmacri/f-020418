
import React from 'react';
import { Product } from '@/services/productService';
import { formatPrice } from '@/lib/product-utils';
import ProductComparisonRow from './ProductComparisonRow';

interface ProductPriceRowProps {
  products: Product[];
  bestProductId: string | number | null;
}

const ProductPriceRow: React.FC<ProductPriceRowProps> = ({ products, bestProductId }) => {
  return (
    <ProductComparisonRow 
      label="Price"
      products={products}
      cellRenderer={(product) => (
        <span className="font-bold text-indigo-600">{formatPrice(product.price)}</span>
      )}
      bestProductId={bestProductId ? String(bestProductId) : null}
    />
  );
};

export default ProductPriceRow;
