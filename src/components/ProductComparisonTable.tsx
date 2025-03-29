
import React from 'react';
import { formatPrice } from '@/lib/product-utils';
import { Star } from 'lucide-react';
import { Product } from '@/services/productService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { handleAffiliateClick } from '@/lib/affiliate-utils';

interface ProductComparisonTableProps {
  products: Product[];
  comparisonFields?: string[];
  highlightBestProduct?: boolean;
}

const ProductComparisonTable: React.FC<ProductComparisonTableProps> = ({ 
  products,
  comparisonFields = ['Best For', 'Price', 'Rating', 'Brand', 'Features'],
  highlightBestProduct = true
}) => {
  // Find the product with the highest rating (best product)
  const bestProduct = highlightBestProduct 
    ? products.reduce((best, current) => 
        current.rating > best.rating ? current : best, products[0])
    : null;

  // Get all unique specification keys from all products
  const allSpecKeys = new Set<string>();
  products.forEach(product => {
    if (product.specifications) {
      Object.keys(product.specifications).forEach(key => allSpecKeys.add(key));
    }
  });
  
  const specificationKeys = Array.from(allSpecKeys);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-4 py-2 bg-white"></th>
            {products.map((product, index) => (
              <th key={index} className={`border px-4 py-4 text-center ${product.id === bestProduct?.id ? 'bg-amber-50' : 'bg-white'}`}>
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mx-auto mb-2">
                    <img 
                      src={product.images[0]?.url || product.imageUrl} 
                      alt={product.name} 
                      className="object-contain w-full h-full" 
                    />
                    {product.id === bestProduct?.id && (
                      <Badge className="absolute -top-2 -right-2 bg-amber-500">
                        Top Pick
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Price row */}
          <tr>
            <td className="border px-4 py-2 font-medium bg-gray-50">Price</td>
            {products.map((product, index) => (
              <td key={index} className={`border px-4 py-2 text-center ${product.id === bestProduct?.id ? 'bg-amber-50' : 'bg-white'}`}>
                <div className="font-bold text-indigo-600">
                  {formatPrice(product.price)}
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="text-gray-400 line-through text-sm">
                    {formatPrice(product.originalPrice)}
                  </div>
                )}
              </td>
            ))}
          </tr>

          {/* Rating row */}
          <tr>
            <td className="border px-4 py-2 font-medium bg-gray-50">Rating</td>
            {products.map((product, index) => (
              <td key={index} className={`border px-4 py-2 text-center ${product.id === bestProduct?.id ? 'bg-amber-50' : 'bg-white'}`}>
                <div className="flex items-center justify-center">
                  <span className="mr-1">{product.rating.toFixed(1)}</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-gray-500 text-xs">({product.reviewCount})</span>
                </div>
              </td>
            ))}
          </tr>

          {/* Brand row if available */}
          {products.some(p => p.brand) && (
            <tr>
              <td className="border px-4 py-2 font-medium bg-gray-50">Brand</td>
              {products.map((product, index) => (
                <td key={index} className={`border px-4 py-2 text-center ${product.id === bestProduct?.id ? 'bg-amber-50' : 'bg-white'}`}>
                  {product.brand || 'N/A'}
                </td>
              ))}
            </tr>
          )}

          {/* Features row if available */}
          {products.some(p => p.features && p.features.length > 0) && (
            <tr>
              <td className="border px-4 py-2 font-medium bg-gray-50">Key Features</td>
              {products.map((product, index) => (
                <td key={index} className={`border px-4 py-2 ${product.id === bestProduct?.id ? 'bg-amber-50' : 'bg-white'}`}>
                  {product.features && product.features.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm">
                      {product.features.slice(0, 3).map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                      {product.features.length > 3 && (
                        <li className="text-indigo-600">+ {product.features.length - 3} more</li>
                      )}
                    </ul>
                  ) : (
                    <span className="text-gray-500">No features listed</span>
                  )}
                </td>
              ))}
            </tr>
          )}

          {/* Specifications rows */}
          {specificationKeys.length > 0 && specificationKeys.map(specKey => (
            <tr key={specKey}>
              <td className="border px-4 py-2 font-medium bg-gray-50">{specKey}</td>
              {products.map((product, index) => (
                <td key={index} className={`border px-4 py-2 text-center ${product.id === bestProduct?.id ? 'bg-amber-50' : 'bg-white'}`}>
                  {product.specifications?.[specKey] || 'N/A'}
                </td>
              ))}
            </tr>
          ))}

          {/* Buy button row */}
          <tr>
            <td className="border px-4 py-2 bg-gray-50"></td>
            {products.map((product, index) => (
              <td key={index} className={`border px-4 py-4 text-center ${product.id === bestProduct?.id ? 'bg-amber-50' : 'bg-white'}`}>
                <Button
                  onClick={() => {
                    const url = product.affiliateLink || product.affiliateUrl || 
                      (product.asin ? `https://www.amazon.com/dp/${product.asin}?tag=recoveryessentials-20` : '#');
                    handleAffiliateClick(url, product.id, product.name, product.asin);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Check Price
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductComparisonTable;
