
import React from 'react';
import { Link } from 'react-router-dom';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Product } from '@/services/productService';
import { handleAffiliateClick } from '@/lib/affiliate-utils';

interface ProductActionsRowProps {
  products: Product[];
  bestProductId: number | null;
  showReviewLink?: boolean;
}

const ProductActionsRow: React.FC<ProductActionsRowProps> = ({ 
  products, 
  bestProductId,
  showReviewLink = true
}) => {
  return (
    <TableRow>
      <TableCell className="font-medium">Actions</TableCell>
      {products.map(product => (
        <TableCell key={product.id} className={`text-center ${product.id === bestProductId ? 'bg-amber-50' : ''}`}>
          <div className="flex flex-col space-y-2">
            <Button
              size="sm"
              onClick={() => {
                const url = product.affiliateLink || product.affiliateUrl || 
                  (product.asin ? `https://www.amazon.com/dp/${product.asin}?tag=recoveryessentials-20` : '#');
                handleAffiliateClick(url, product.id, product.name, product.asin);
              }}
              className="w-full"
            >
              View on Amazon
            </Button>
            
            {showReviewLink && (
              <Button size="sm" variant="outline" asChild className="w-full">
                <Link to={`/products/${product.slug}`}>Read Review</Link>
              </Button>
            )}
          </div>
        </TableCell>
      ))}
    </TableRow>
  );
};

export default ProductActionsRow;
