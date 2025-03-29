
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { handleAffiliateClick } from '@/lib/affiliate-utils';
import { formatPrice } from '@/lib/product-utils';
import { Product } from '@/services/productService';

interface BestOfListProps {
  title: string;
  subtitle?: string;
  products: Product[];
  categorySlug?: string;
  showViewAll?: boolean;
  maxItems?: number;
}

const BestOfList: React.FC<BestOfListProps> = ({
  title,
  subtitle,
  products,
  categorySlug,
  showViewAll = true,
  maxItems = 5
}) => {
  // Ensure we don't exceed available products
  const displayProducts = products.slice(0, Math.min(maxItems, products.length));
  
  // Only show View All if we have more products than we're displaying
  const shouldShowViewAll = showViewAll && products.length > maxItems;
  
  // Get award labels for positions
  const getAwardLabel = (index: number): string => {
    switch (index) {
      case 0: return "Best Overall";
      case 1: return "Runner-Up";
      case 2: return "Best Value";
      case 3: return "Budget Pick";
      default: return "Top Pick";
    }
  };
  
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
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {shouldShowViewAll && categorySlug && (
          <Link 
            to={`/categories/${categorySlug}`}
            className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </div>
      
      <div className="space-y-6">
        {displayProducts.map((product, index) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 p-4 flex items-center justify-center bg-gray-50">
                  <div className="relative">
                    <img 
                      src={getProductImageUrl(product)} 
                      alt={product.name} 
                      className="max-h-40 object-contain" 
                    />
                    {index === 0 && (
                      <div className="absolute -top-2 -right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full border border-amber-200 flex items-center">
                        <Award className="h-3 w-3 mr-1" />
                        Editor's Choice
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="md:w-3/4 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mb-2">
                        {getAwardLabel(index)}
                      </div>
                      <h3 className="text-lg font-semibold mb-1">
                        <Link to={`/products/${product.slug}`} className="hover:text-indigo-600">
                          {product.name}
                        </Link>
                      </h3>
                    </div>
                    <div className="text-xl font-bold text-indigo-600">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex text-amber-400 mr-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'fill-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">{product.rating.toFixed(1)} ({product.reviewCount})</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.shortDescription || (product.description && product.description.substring(0, 150))}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.features && product.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {feature.length > 30 ? `${feature.substring(0, 30)}...` : feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => {
                        const url = product.affiliateLink || product.affiliateUrl || 
                          (product.asin ? `https://www.amazon.com/dp/${product.asin}?tag=recoveryessentials-20` : '#');
                        handleAffiliateClick(url, product.id, product.name, product.asin);
                      }}
                      className="bg-amber-500 hover:bg-amber-600"
                    >
                      View on Amazon
                    </Button>
                    
                    <Button variant="outline" asChild>
                      <Link to={`/products/${product.slug}`}>
                        Read Review
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BestOfList;
