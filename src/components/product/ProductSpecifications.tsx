
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/services/productService';

interface ProductSpecificationsProps {
  product: Product;
  onBuyNow: () => void;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ product, onBuyNow }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Product Details</h3>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-gray-500">Brand</td>
              <td className="py-2 text-gray-900 font-medium">{product.title.split(' ')[0]}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-gray-500">Model</td>
              <td className="py-2 text-gray-900 font-medium">{product.title.split(' ').slice(1, 3).join(' ')}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-gray-500">Category</td>
              <td className="py-2 text-gray-900 font-medium">
                {product.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-gray-500">ASIN</td>
              <td className="py-2 text-gray-900 font-medium">{product.asin}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Shipping & Returns</h3>
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
    </div>
  );
};

export default ProductSpecifications;
