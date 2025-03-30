
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Minus } from 'lucide-react';
import { Product } from '@/services/productService';

interface ProductComparisonRowProps {
  label: string;
  products: Product[];
  cellRenderer: (product: Product) => React.ReactNode;
  bestProductId: string | number | null;
}

const ProductComparisonRow: React.FC<ProductComparisonRowProps> = ({
  label,
  products,
  cellRenderer,
  bestProductId
}) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{label}</TableCell>
      {products.map(product => (
        <TableCell 
          key={String(product.id)} 
          className={`text-center ${String(product.id) === String(bestProductId) ? 'bg-amber-50' : ''}`}
        >
          {cellRenderer(product)}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default ProductComparisonRow;
