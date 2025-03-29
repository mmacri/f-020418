
import React from 'react';
import { formatPrice } from '@/lib/product-utils';
import { Product } from '@/services/productService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import { handleAffiliateClick } from '@/lib/affiliate-utils';
import { Link } from 'react-router-dom';

interface QuickCompareProps {
  products: Product[];
  title?: string;
  showViewFullComparison?: boolean;
  comparisonUrl?: string;
}

const QuickCompare: React.FC<QuickCompareProps> = ({ 
  products, 
  title = "Quick Comparison", 
  showViewFullComparison = true,
  comparisonUrl = "/product-comparison"
}) => {
  if (products.length < 2) return null;

  // Limit to 3 products for quick comparison
  const displayProducts = products.slice(0, 3);

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
                src={typeof product.images[0] === 'string' 
                  ? product.images[0] 
                  : product.images[0]?.url || product.imageUrl} 
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
                  <span className="line-clamp-1">{product.specifications?.['Best For'] || 'Great all-around'}</span>
                </div>
                {product.rating && (
                  <div className="flex items-center text-gray-700">
                    <Check className="h-4 w-4 text-green-500 mr-1" />
                    <span>{product.rating.toFixed(1)}/5 ({product.reviewCount} reviews)</span>
                  </div>
                )}
              </div>
              <Button
                onClick={() => {
                  const url = product.affiliateLink || product.affiliateUrl || 
                    (product.asin ? `https://www.amazon.com/dp/${product.asin}?tag=recoveryessentials-20` : '#');
                  handleAffiliateClick(url, product.id, product.name, product.asin);
                }}
                className="w-full"
                variant="outline"
                size="sm"
              >
                View on Amazon
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickCompare;
