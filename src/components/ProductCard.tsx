
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, getProductUrl } from '@/lib/product-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, StarHalf } from 'lucide-react';
import { Product } from '@/services/products/types';
import { extractImageUrl } from '@/services/products/mappers';
import { Badge } from '@/components/ui/badge';

type ProductImage = {
  url: string;
};

interface ProductCardProps {
  product: Product;
  isLoading?: boolean;
  featured?: boolean;
  onClick?: () => void;
  layout?: 'vertical' | 'horizontal';
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isLoading = false, 
  featured = false,
  onClick,
  layout = 'vertical'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  if (isLoading) {
    return (
      <div className="card product-card rounded-lg shadow-sm overflow-hidden bg-white h-full flex flex-col">
        <div className="product-card__image p-4 flex items-center justify-center h-48 bg-white">
          <Skeleton className="w-full h-full rounded-md" />
        </div>
        <div className="product-card__content p-4 flex-grow flex flex-col">
          <Skeleton className="h-6 w-3/4 rounded-md mb-2" />
          <Skeleton className="h-4 w-1/4 rounded-md mb-2" />
          <Skeleton className="h-6 w-1/3 rounded-md mb-3" />
          <Skeleton className="h-10 w-full rounded-md mt-auto" />
        </div>
      </div>
    );
  }

  // Get product image - handle different image formats
  const getProductImageUrl = (product: Product): string => {
    if (product.imageUrl) {
      return product.imageUrl;
    }
    
    if (product.images && product.images.length > 0) {
      return extractImageUrl(product.images[0]);
    }
    
    return '/placeholder.svg';
  };

  const handleProductClick = (e: React.MouseEvent) => {
    // Don't prevent default here - we want the link to navigate
    if (onClick) {
      onClick();
    }
  };

  // Horizontal layout for list view
  if (layout === 'horizontal') {
    return (
      <div className={`card product-card rounded-lg shadow-sm overflow-hidden bg-white ${featured ? 'border-2 border-indigo-200' : 'border border-gray-100'}`}>
        <div className="flex flex-col sm:flex-row h-full">
          <div className="product-card__image sm:w-1/4 p-4 flex items-center justify-center bg-white relative">
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 m-4" />
            )}
            <img
              src={getProductImageUrl(product)}
              alt={product.name}
              className="max-h-32 sm:max-h-full object-contain transition-opacity duration-300"
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
                setImageLoaded(true);
              }}
            />
            {product.bestSeller && (
              <Badge className="absolute top-2 left-2 bg-amber-500 text-white">Best Seller</Badge>
            )}
          </div>
          
          <div className="product-card__content p-4 sm:w-3/4 flex flex-col justify-between">
            <div>
              <h3 className="product-card__title text-lg font-medium mb-2">
                <Link 
                  to={getProductUrl(product)} 
                  className="text-gray-800 hover:text-indigo-600"
                  onClick={handleProductClick}
                >
                  {product.name}
                </Link>
              </h3>
              
              <div className="product-card__rating text-amber-500 mb-2 flex items-center">
                {[...Array(5)].map((_, i) => {
                  if (i < Math.floor(product.rating)) {
                    return <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />;
                  } else if (i === Math.floor(product.rating) && product.rating % 1 >= 0.5) {
                    return <StarHalf key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />;
                  }
                  return <Star key={i} className="w-4 h-4 text-gray-300" />;
                })}
                <span className="text-sm text-gray-500 ml-1">({product.reviewCount || 0})</span>
              </div>
              
              {product.shortDescription && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.shortDescription}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="product-card__price font-bold text-lg text-indigo-600">
                {formatPrice(product.price)}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-gray-400 line-through text-sm ml-2">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              
              <Link 
                to={getProductUrl(product)} 
                className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md inline-block text-center"
                onClick={handleProductClick}
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default vertical layout
  return (
    <div className={`card product-card rounded-lg shadow-sm overflow-hidden bg-white h-full flex flex-col ${featured ? 'border-2 border-indigo-200' : 'border border-gray-100'}`}>
      <div className="product-card__image p-4 flex items-center justify-center h-48 bg-white relative">
        {!imageLoaded && (
          <Skeleton className="absolute inset-0 m-4" />
        )}
        <img
          src={getProductImageUrl(product)}
          alt={product.name}
          className="max-h-full object-contain transition-opacity duration-300"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
            setImageLoaded(true);
          }}
        />
        {product.bestSeller && (
          <Badge className="absolute top-2 left-2 bg-amber-500 text-white">Best Seller</Badge>
        )}
      </div>
      <div className="product-card__content p-4 flex-grow flex flex-col">
        <h3 className="product-card__title text-lg font-medium mb-2">
          <Link 
            to={getProductUrl(product)} 
            className="text-gray-800 hover:text-indigo-600"
            onClick={handleProductClick}
          >
            {product.name}
          </Link>
        </h3>
        <div className="product-card__rating text-amber-500 mb-2 flex items-center">
          {[...Array(5)].map((_, i) => {
            if (i < Math.floor(product.rating)) {
              return <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />;
            } else if (i === Math.floor(product.rating) && product.rating % 1 >= 0.5) {
              return <StarHalf key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />;
            }
            return <Star key={i} className="w-4 h-4 text-gray-300" />;
          })}
          <span className="text-sm text-gray-500 ml-1">({product.reviewCount || 0})</span>
        </div>
        <div className="product-card__price font-bold text-lg text-indigo-600 mb-3">
          {formatPrice(product.price)}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-gray-400 line-through text-sm ml-2">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="product-card__actions mt-auto">
          <Link 
            to={getProductUrl(product)} 
            className="btn btn-primary w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md inline-block text-center"
            onClick={handleProductClick}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
