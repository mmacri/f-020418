
import React from 'react';
import { Check } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Product } from '@/services/productService';

interface ProductProsRowProps {
  products: Product[];
  bestProductId: string | number | null;
}

const ProductProsRow: React.FC<ProductProsRowProps> = ({ products, bestProductId }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">Pros</TableCell>
      {products.map(product => (
        <TableCell 
          key={String(product.id)} 
          className={String(product.id) === String(bestProductId) ? 'bg-amber-50' : ''}
        >
          {product.pros && product.pros.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {product.pros.slice(0, 3).map((pro, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-400">No pros listed</span>
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default ProductProsRow;
