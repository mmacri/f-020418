
import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, generateProductUrl } from '@/lib/product-utils';

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
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="card product-card rounded-lg shadow-sm overflow-hidden bg-white h-full flex flex-col">
      <div className="product-card__image p-4 flex items-center justify-center h-48 bg-white">
        <img 
          src={product.images && product.images.length ? product.images[0].url : '/placeholder.svg'} 
          alt={product.name} 
          className="max-h-full object-contain"
        />
      </div>
      <div className="product-card__content p-4 flex-grow flex flex-col">
        <h3 className="product-card__title text-lg font-medium mb-2">
          <Link to={generateProductUrl(product)} className="text-gray-800 hover:text-indigo-600">
            {product.name}
          </Link>
        </h3>
        <div className="product-card__rating text-amber-500 mb-2">
          {'★'.repeat(Math.floor(product.rating))}
          {product.rating % 1 >= 0.5 ? '½' : ''}
          {'☆'.repeat(5 - Math.ceil(product.rating))}
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
            to={generateProductUrl(product)} 
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
