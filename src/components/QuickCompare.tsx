
import React from 'react';
import { formatPrice } from '@/lib/product-utils';
import { Product } from '@/services/productService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import { handleAffiliateClick } from '@/lib/affiliate-utils';
import { Link } from 'react-router-dom';

interface QuickCompareProps {
  products: Product[];
  title?: string;
  showViewFullComparison?: boolean;
  comparisonUrl?: string;
  buttonText?: string;
}

const QuickCompare: React.FC<QuickCompareProps> = ({ 
  products, 
  title = "Quick Comparison", 
  showViewFullComparison = true,
  comparisonUrl = "/product-comparison",
  buttonText = "View on Amazon"
}) => {
  if (products.length < 2) return null;

  // Limit to 3 products for quick comparison
  const displayProducts = products.slice(0, 3);

  // Helper to get image URL from product
  const getProductImageUrl = (product: Product): string => {
    if (!product.images || product.images.length === 0) {
      return product.imageUrl || '/placeholder.svg';
    }
    
    const firstImage = product.images[0];
    if (typeof firstImage === 'string') {
      return firstImage;
    } else if (firstImage && typeof firstImage === 'object') {
      // Safely check for url property without assuming its structure
      return (firstImage as any).url || product.imageUrl || '/placeholder.svg';
    }
    
    return product.imageUrl || '/placeholder.svg';
  };

  // Helper to get the affiliate URL for a product
  const getAffiliateUrl = (product: Product): string => {
    // Try different possible property names for affiliate links
    return product.affiliateLink || product.affiliateUrl || 
      (product.asin ? `https://www.amazon.com/dp/${product.asin}?tag=recoveryessentials-20` : '#');
  };

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        {showViewFullComparison && (
          <Link to={comparisonUrl} className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
            View Full Comparison <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="h-40 bg-gray-50 p-4 flex items-center justify-center">
              <img 
                src={getProductImageUrl(product)} 
                alt={product.name} 
                className="max-h-full object-contain" 
              />
            </div>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 line-clamp-2">{product.name}</h4>
              <div className="text-indigo-600 font-bold mb-2">
                {formatPrice(product.price)}
              </div>
              <div className="mb-3 text-sm">
                <div className="flex items-center text-gray-700 mb-1">
                  <Check className="h-4 w-4 text-green-500 mr-1" />
                  <span className="line-clamp-1">{product.specifications?.['Best For'] || product.shortDescription || 'Great all-around'}</span>
                </div>
                {product.rating && (
                  <div className="flex items-center text-gray-700">
                    <Check className="h-4 w-4 text-green-500 mr-1" />
                    <span>{product.rating.toFixed(1)}/5 ({product.reviewCount} reviews)</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    const url = getAffiliateUrl(product);
                    handleAffiliateClick(url, product.id, product.name, product.asin);
                  }}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  {buttonText}
                </Button>
                <Link to={`/products/${product.slug || product.id}`} className="text-xs text-center text-gray-500 hover:text-gray-700">
                  View details
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickCompare;
