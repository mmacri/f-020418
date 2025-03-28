
import React from 'react';
import { ArrowUpRight, Heart, Check, ShoppingCart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/services/productService';
import SaveForLater from '@/components/product/SaveForLater';
import { useToast } from '@/hooks/use-toast';

interface ProductInfoProps {
  product: Product;
  onShare: () => void;
  onBuyNow: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, onShare, onBuyNow }) => {
  // Calculate discount percentage
  const discountPercentage = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="md:w-1/2">
      {product.bestSeller && (
        <div className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md mb-2">
          #1 Best Seller
        </div>
      )}
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
      
      <div className="flex items-center mb-4">
        <div className="flex text-amber-400 mr-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>
              {i < Math.floor(product.rating) ? "★" : 
                i === Math.floor(product.rating) && product.rating % 1 > 0 ? "★" : "☆"}
            </span>
          ))}
        </div>
        <span className="text-gray-600 text-sm">{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
      </div>
      
      <div className="mb-6">
        <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
        {discountPercentage && (
          <>
            <span className="text-gray-500 line-through ml-2">${product.originalPrice!.toFixed(2)}</span>
            <span className="text-green-600 ml-2">Save {discountPercentage}%</span>
          </>
        )}
      </div>
      
      <div className="mb-6">
        <p className="text-gray-700">
          {product.shortDescription || product.description.substring(0, 150) + '...'}
        </p>
      </div>
      
      <div className="mb-6 flex items-center">
        <span className={`inline-flex items-center ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
          {product.inStock ? (
            <>
              <Check className="h-5 w-5 mr-1" />
              In Stock
            </>
          ) : (
            <>
              <span className="h-5 w-5 mr-1">✕</span>
              Out of Stock
            </>
          )}
        </span>
      </div>
      
      <div className="mb-8 flex space-x-4">
        <Button 
          className="flex items-center"
          onClick={onBuyNow}
          disabled={!product.inStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Buy on Amazon
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Button>
        
        <SaveForLater 
          productId={product.id} 
          productName={product.title}
        />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onShare}
          className="rounded-full"
          aria-label="Share"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold mb-3">About this item</h3>
        {product.features && product.features.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">{product.description}</p>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
