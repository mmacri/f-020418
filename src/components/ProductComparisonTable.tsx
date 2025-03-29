
import React from 'react';
import { Check, X, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleAffiliateClick } from '@/lib/affiliate-utils';
import { formatPrice } from '@/lib/product-utils';
import { Product } from '@/services/productService';

interface ProductComparisonTableProps {
  products: Product[];
  highlightBestProduct?: boolean;
}

const ProductComparisonTable: React.FC<ProductComparisonTableProps> = ({ 
  products,
  highlightBestProduct = false
}) => {
  if (products.length < 2) return null;
  
  // Find the best overall product based on rating if needed
  const bestProductId = highlightBestProduct
    ? products.reduce((bestId, product, _, arr) => {
        const current = arr.find(p => p.id === bestId);
        return (current && current.rating > product.rating) ? bestId : product.id;
      }, products[0].id)
    : null;
  
  // Get all unique specification keys from all products
  const allSpecKeys = Array.from(
    new Set(
      products.flatMap(product => 
        product.specifications ? Object.keys(product.specifications) : []
      )
    )
  );
  
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-gray-700 text-md font-semibold border-b">Features</th>
            {products.map((product) => (
              <th key={product.id} className="px-4 py-3 text-gray-700 font-semibold border-b min-w-[260px]">
                <div className="space-y-2">
                  <div className="h-32 flex items-center justify-center mb-2">
                    <img 
                      src={typeof product.images[0] === 'string' 
                        ? product.images[0] 
                        : product.images[0]?.url || product.imageUrl} 
                      alt={product.name} 
                      className="max-h-full max-w-[180px] object-contain" 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-md ${product.id === bestProductId ? 'text-amber-600 font-bold' : ''}`}>
                      {product.id === bestProductId && (
                        <Award className="h-4 w-4 inline mr-1 text-amber-500" />
                      )}
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="text-amber-500 mr-1">
                      {Array(5).fill(0).map((_, i) => (
                        <span key={i}>{i < Math.floor(product.rating) ? "★" : "☆"}</span>
                      ))}
                    </span>
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          <tr className="bg-white">
            <td className="px-4 py-3 font-medium text-gray-700">Price</td>
            {products.map((product) => (
              <td key={`${product.id}-price`} className={`px-4 py-3 ${product.id === bestProductId ? 'bg-amber-50' : ''}`}>
                <div className="font-bold text-indigo-600">{formatPrice(product.price)}</div>
                {product.originalPrice && (
                  <div className="text-gray-500 line-through text-xs">
                    {formatPrice(product.originalPrice)}
                  </div>
                )}
              </td>
            ))}
          </tr>
          
          {/* Specifications rows */}
          {allSpecKeys.map((specKey) => (
            <tr key={specKey} className="bg-white">
              <td className="px-4 py-3 font-medium text-gray-700">{specKey}</td>
              {products.map((product) => (
                <td 
                  key={`${product.id}-${specKey}`} 
                  className={`px-4 py-3 ${product.id === bestProductId ? 'bg-amber-50' : ''}`}
                >
                  {product.specifications && product.specifications[specKey] 
                    ? product.specifications[specKey] 
                    : <span className="text-gray-400">—</span>}
                </td>
              ))}
            </tr>
          ))}
          
          {/* Features rows - show first 3 features */}
          <tr className="bg-white">
            <td className="px-4 py-3 font-medium text-gray-700">Key Features</td>
            {products.map((product) => (
              <td 
                key={`${product.id}-features`} 
                className={`px-4 py-3 ${product.id === bestProductId ? 'bg-amber-50' : ''}`}
              >
                <ul className="list-disc pl-5 space-y-1">
                  {product.features ? (
                    product.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-gray-700">{feature}</li>
                    ))
                  ) : (
                    <li className="text-gray-400">No features listed</li>
                  )}
                </ul>
              </td>
            ))}
          </tr>
          
          {/* In stock status */}
          <tr className="bg-white">
            <td className="px-4 py-3 font-medium text-gray-700">Availability</td>
            {products.map((product) => (
              <td 
                key={`${product.id}-stock`} 
                className={`px-4 py-3 ${product.id === bestProductId ? 'bg-amber-50' : ''}`}
              >
                {product.inStock !== false ? (
                  <span className="text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    In Stock
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    Out of Stock
                  </span>
                )}
              </td>
            ))}
          </tr>
          
          {/* Buy button */}
          <tr className="bg-gray-50">
            <td className="px-4 py-4 font-medium text-gray-700"></td>
            {products.map((product) => (
              <td key={`${product.id}-buy`} className="px-4 py-4">
                <Button
                  className={`w-full ${product.id === bestProductId ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                  onClick={() => {
                    const url = product.affiliateLink || product.affiliateUrl || 
                      (product.asin ? `https://www.amazon.com/dp/${product.asin}?tag=recoveryessentials-20` : '#');
                    handleAffiliateClick(url, product.id, product.name, product.asin);
                  }}
                  disabled={product.inStock === false}
                >
                  View on Amazon
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
