
import React from 'react';
import { ArrowUpRight, ExternalLink, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/services/productService';
import { getAffiliateCookieInfo } from '@/lib/affiliate-utils';

interface ProductSpecificationsProps {
  product: Product;
  onBuyNow: () => void;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ product, onBuyNow }) => {
  // Get affiliate cookie info to show countdown if active
  const { active, hoursRemaining, minutesRemaining } = getAffiliateCookieInfo();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 p-5 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">Product Details</h3>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-gray-500">Brand</td>
              <td className="py-2 text-gray-900 font-medium">{product.brand || product.title?.split(' ')[0] || 'N/A'}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-gray-500">Model</td>
              <td className="py-2 text-gray-900 font-medium">{product.title?.split(' ').slice(1, 3).join(' ') || 'N/A'}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-gray-500">Category</td>
              <td className="py-2 text-gray-900 font-medium">
                {product.category?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'N/A'}
              </td>
            </tr>
            {product.asin && (
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-500">ASIN</td>
                <td className="py-2 text-gray-900 font-medium">{product.asin}</td>
              </tr>
            )}
            {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
              <tr key={key} className="border-b border-gray-200">
                <td className="py-2 text-gray-500">{key}</td>
                <td className="py-2 text-gray-900 font-medium">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex flex-col">
        <div className="bg-gray-50 p-5 rounded-lg mb-4">
          <h3 className="font-medium text-gray-900 mb-3">Shipping & Returns</h3>
          <p className="text-gray-700 mb-4 text-sm">
            This product is fulfilled by Amazon. Free delivery on eligible orders and easy returns within 30 days of receipt.
          </p>
          <Button 
            variant="link" 
            className="text-indigo-600 p-0 h-auto text-sm"
            onClick={onBuyNow}
          >
            View shipping details on Amazon
            <ArrowUpRight className="ml-1 h-3 w-3 inline" />
          </Button>
        </div>
        
        {active && (
          <div className="bg-blue-50 p-5 rounded-lg mb-4 border border-blue-100">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">Amazon Cookie Status</h3>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              You have an active Amazon affiliate cookie that will support us when you purchase any product.
            </p>
            <p className="text-sm font-medium text-blue-700">
              Time remaining: {hoursRemaining}h {minutesRemaining}m
            </p>
          </div>
        )}
        
        <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
          <h3 className="font-medium text-gray-900 mb-3">Why Buy Through Our Link?</h3>
          <ul className="text-sm space-y-2 text-gray-700 mb-4">
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">✓</span>
              <span>Same Amazon price and shopping experience</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">✓</span>
              <span>Support our product research and testing</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">✓</span>
              <span>Help us create more free recovery guides</span>
            </li>
          </ul>
          <Button 
            className="w-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center"
            onClick={onBuyNow}
          >
            Check Current Price
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-xs text-center mt-3 text-gray-500">
            As an Amazon Associate we earn from qualifying purchases
          </p>
          <div className="mt-3 text-xs text-gray-500 flex items-start">
            <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
            <span>We only recommend products we've thoroughly researched and tested</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecifications;
