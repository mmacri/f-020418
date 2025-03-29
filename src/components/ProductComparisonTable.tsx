
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, Minus, Star } from 'lucide-react';
import { Product } from '@/services/productService';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/product-utils';
import { handleAffiliateClick } from '@/lib/affiliate-utils';

interface ProductComparisonTableProps {
  products: Product[];
  showReviewLink?: boolean;
}

const ProductComparisonTable: React.FC<ProductComparisonTableProps> = ({ 
  products, 
  showReviewLink = true
}) => {
  // Get common specifications keys
  const getSpecKeys = () => {
    const allKeys = new Set<string>();
    
    products.forEach(product => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach(key => allKeys.add(key));
      }
    });
    
    // Prioritize important specs
    const priorityKeys = [
      'Brand', 'Model', 'Weight', 'Dimensions', 'Power', 'Battery Life',
      'Speed Settings', 'Attachments', 'Warranty', 'Noise Level', 'Best For'
    ];
    
    const sortedKeys = [...allKeys].sort((a, b) => {
      const indexA = priorityKeys.indexOf(a);
      const indexB = priorityKeys.indexOf(b);
      
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
    
    return sortedKeys;
  };
  
  const specKeys = getSpecKeys();
  
  // Helper to get image URL from product
  const getProductImageUrl = (product: Product): string => {
    if (!product.images || product.images.length === 0) {
      return product.imageUrl || '/placeholder.svg';
    }
    
    const firstImage = product.images[0];
    if (typeof firstImage === 'string') {
      return firstImage;
    } else if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
      return firstImage.url || product.imageUrl || '/placeholder.svg';
    }
    
    return product.imageUrl || '/placeholder.svg';
  };

  return (
    <div className="overflow-x-auto">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead className="w-48">Product</TableHead>
            {products.map(product => (
              <TableHead key={product.id} className="w-48 text-center">
                <div className="flex flex-col items-center space-y-2 p-2">
                  <div className="h-24 flex items-center justify-center">
                    <img 
                      src={getProductImageUrl(product)}
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
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Price</TableCell>
            {products.map(product => (
              <TableCell key={product.id} className="text-center font-bold text-indigo-600">
                {formatPrice(product.price)}
              </TableCell>
            ))}
          </TableRow>
          
          <TableRow>
            <TableCell className="font-medium">Rating</TableCell>
            {products.map(product => (
              <TableCell key={product.id} className="text-center">
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
              </TableCell>
            ))}
          </TableRow>
          
          {specKeys.map(key => (
            <TableRow key={key}>
              <TableCell className="font-medium">{key}</TableCell>
              {products.map(product => (
                <TableCell key={product.id} className="text-center">
                  {product.specifications && product.specifications[key] 
                    ? product.specifications[key] 
                    : <Minus className="mx-auto h-4 w-4 text-gray-300" />
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
          
          <TableRow>
            <TableCell className="font-medium">Key Features</TableCell>
            {products.map(product => (
              <TableCell key={product.id}>
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
          
          <TableRow>
            <TableCell className="font-medium">Pros</TableCell>
            {products.map(product => (
              <TableCell key={product.id}>
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
          
          <TableRow>
            <TableCell className="font-medium">Actions</TableCell>
            {products.map(product => (
              <TableCell key={product.id} className="text-center">
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
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductComparisonTable;
