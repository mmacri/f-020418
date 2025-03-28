
import React, { useState } from 'react';
import { formatPrice } from '@/lib/product-utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductImage {
  url: string;
}

interface ProductProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    features?: string[];
    images: ProductImage[];
    asin?: string;
  };
}

const FeaturedProduct: React.FC<ProductProps> = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = product.images && product.images.length ? product.images[0].url : '/placeholder.svg';

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold mb-10 text-center">Our Top Pick: {product.name}</h2>

        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="md:w-1/2 relative">
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 rounded-lg" />
            )}
            <img 
              src={imageUrl}
              alt={product.name} 
              className={`rounded-lg shadow-md w-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={handleImageLoad}
            />
          </div>
          <div className="md:w-1/2">
            <div className="mb-3 text-amber-500">
              <span className="text-xl font-bold">{product.rating}/5</span>
              <span className="ml-2">
                {'★'.repeat(Math.floor(product.rating))}
                {product.rating % 1 >= 0.5 ? '½' : ''}
                {'☆'.repeat(5 - Math.ceil(product.rating))}
              </span>
              <span className="text-sm text-gray-500 ml-1">({product.reviewCount}+ reviews)</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{product.name}</h3>
            <p className="text-gray-800 mb-3 text-lg font-semibold">{formatPrice(product.price)}</p>
            <div className="mb-5">
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">Professional Quality</span>
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">Latex-Free Options</span>
            </div>
            <p className="text-gray-600 mb-6">
              {product.description}
            </p>
            {product.asin && (
              <Button 
                onClick={() => window.open(`https://www.amazon.com/dp/${product.asin}?tag=recoveryessentials-20`, '_blank')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                Check Price on Amazon
              </Button>
            )}
          </div>
        </div>

        {product.features && product.features.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4">Why We Love It</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {product.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-indigo-600 mb-2">✓</div>
                  <h4 className="font-bold mb-2">{feature.split(':')[0]}</h4>
                  <p className="text-sm text-gray-600">{feature.split(':')[1] || 'Professional quality design with durable construction.'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProduct;
