
import React from 'react';
import { Link } from 'react-router-dom';
import { TableHead, TableRow } from '@/components/ui/table';
import { Product } from '@/services/productService';
import { getProductImageUrl } from '@/lib/images';

interface ProductTableHeaderProps {
  products: Product[];
  bestProductId: string | number | null;
}

const ProductTableHeader: React.FC<ProductTableHeaderProps> = ({ products, bestProductId }) => {
  return (
    <TableRow>
      <TableHead className="w-48">Product</TableHead>
      {products.map(product => (
        <TableHead 
          key={String(product.id)} 
          className={`w-48 text-center ${String(product.id) === String(bestProductId) ? 'bg-amber-50' : ''}`}
        >
          <div className="flex flex-col items-center space-y-2 p-2">
            {String(product.id) === String(bestProductId) && (
              <div className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full mb-1">
                Top Rated
              </div>
            )}
            <div className="h-24 flex items-center justify-center">
              <img 
                src={getProductImageUrl(String(product.id))}
                alt={product.name} 
                className="max-h-full max-w-full object-contain" 
              />
            </div>
            <Link to={`/products/${product.slug}`} className="font-bold hover:text-indigo-600 text-sm">
              {product.name}
            </Link>
          </div>
        </TableHead>
      ))}
    </TableRow>
  );
};

export default ProductTableHeader;
