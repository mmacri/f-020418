
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, getProductUrl } from '@/lib/product-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, StarHalf } from 'lucide-react';

type ProductImage = {
  url: string;
};

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    category: string;
    description: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    images: ProductImage[];
  };
  isLoading?: boolean;
  featured?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isLoading = false, featured = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = product?.images && product.images.length ? product.images[0].url : '/placeholder.svg';

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

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

  return (
    <div className={`card product-card rounded-lg shadow-sm overflow-hidden bg-white h-full flex flex-col ${featured ? 'border-2 border-indigo-200' : ''}`}>
      <div className="product-card__image p-4 flex items-center justify-center h-48 bg-white relative">
        {!imageLoaded && (
          <Skeleton className="absolute inset-0 m-4" />
        )}
        <img 
          src={imageUrl} 
          alt={product.name} 
          className={`max-h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={handleImageLoad}
        />
      </div>
      <div className="product-card__content p-4 flex-grow flex flex-col">
        <h3 className="product-card__title text-lg font-medium mb-2">
          <Link to={getProductUrl(product)} className="text-gray-800 hover:text-indigo-600">
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
          <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
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
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
