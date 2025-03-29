
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Product } from '@/services/productService';

interface ProductFeaturesRowProps {
  products: Product[];
  bestProductId: number | null;
}

const ProductFeaturesRow: React.FC<ProductFeaturesRowProps> = ({ products, bestProductId }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">Key Features</TableCell>
      {products.map(product => (
        <TableCell key={product.id} className={product.id === bestProductId ? 'bg-amber-50' : ''}>
          {product.features && product.features.length > 0 ? (
            <ul className="list-disc pl-5 text-sm space-y-1">
              {product.features.slice(0, 3).map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
              {product.features.length > 3 && <li>+ {product.features.length - 3} more</li>}
            </ul>
          ) : (
            <span className="text-gray-400">No features listed</span>
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default ProductFeaturesRow;
