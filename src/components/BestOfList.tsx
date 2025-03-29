
import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, getProductUrl } from '@/lib/product-utils';
import { Product } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Star, Trophy, ArrowRight } from 'lucide-react';
import { handleAffiliateClick } from '@/lib/affiliate-utils';

interface BestOfListProps {
  products: Product[];
  categoryName: string;
  description?: string;
  showFullList?: boolean;
  categoryUrl?: string;
}

const BestOfList: React.FC<BestOfListProps> = ({ 
  products, 
  categoryName, 
  description,
  showFullList = true,
  categoryUrl
}) => {
  if (!products || products.length === 0) return null;

  // Determine rank labels based on position
  const getRankLabel = (index: number): string => {
    switch (index) {
      case 0: return "Best Overall";
      case 1: return "Runner Up";
      case 2: return "Best Value";
      case 3: return "Premium Pick";
      case 4: return "Budget Option";
      default: return `#${index + 1} Pick`;
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Best {categoryName} of {new Date().getFullYear()}</h2>
          {description && <p className="text-gray-600 max-w-3xl mx-auto">{description}</p>}
        </div>

        <div className="space-y-8">
          {products.slice(0, 5).map((product, index) => (
            <div key={product.id} className="flex flex-col md:flex-row border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="md:w-1/4 bg-gray-50 p-6 flex items-center justify-center relative">
                <div className="absolute top-0 left-0 bg-amber-500 text-white px-3 py-1 text-sm font-bold">
                  {getRankLabel(index)}
                </div>
                <img 
                  src={product.images[0]?.url || product.imageUrl} 
                  alt={product.name} 
                  className="max-h-40 object-contain" 
                />
              </div>
              
              <div className="md:w-2/4 p-6">
                <Link to={getProductUrl(product)} className="block mb-2">
                  <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center mb-3">
                  <div className="flex text-amber-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {product.shortDescription || product.description.slice(0, 150) + '...'}
                </p>
                
                {product.features && product.features.length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {product.features.slice(0, 4).map((feature, i) => (
                        <div key={i} className="flex items-start">
                          <Trophy className="h-4 w-4 text-amber-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-600 line-clamp-1">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="md:w-1/4 p-6 flex flex-col justify-between bg-gray-50 border-t md:border-t-0 md:border-l">
                <div>
                  <div className="text-2xl font-bold text-indigo-600 mb-2">
                    {formatPrice(product.price)}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center">
                      <span className="text-gray-400 line-through text-sm mr-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 mt-4">
                  <Button
                    onClick={() => {
                      const url = product.affiliateLink || product.affiliateUrl || 
                        (product.asin ? `https://www.amazon.com/dp/${product.asin}?tag=recoveryessentials-20` : '#');
                      handleAffiliateClick(url, product.id, product.name, product.asin);
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    Check Amazon Price
                  </Button>
                  
                  <Link to={getProductUrl(product)}>
                    <Button variant="outline" className="w-full">
                      Read Full Review
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {showFullList && categoryUrl && products.length > 5 && (
          <div className="mt-10 text-center">
            <Link to={categoryUrl}>
              <Button variant="outline" className="px-6">
                View All {categoryName} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestOfList;
