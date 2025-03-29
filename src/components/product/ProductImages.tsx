
import React, { useState, useEffect } from 'react';
import { Product } from '@/services/productService';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductImagesProps {
  product: Product;
  isLoading?: boolean;
}

const FALLBACK_IMAGE = '/placeholder.svg';

// Helper function to add cache busting to image URLs
const addCacheBusting = (url: string): string => {
  if (!url) return FALLBACK_IMAGE;
  
  // Don't add cache busting to local images
  if (url.startsWith('/')) return url;
  
  // Add timestamp as cache buster
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

const ProductImages: React.FC<ProductImagesProps> = ({ product, isLoading = false }) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imagesLoaded, setImagesLoaded] = useState<{[key: string]: boolean}>({});

  // Initialize selected image and imagesLoaded state when product data changes
  useEffect(() => {
    if (product && product.imageUrl) {
      setSelectedImage(product.imageUrl);
      
      const initialLoadState: {[key: string]: boolean} = { [product.imageUrl]: false };
      
      if (product.additionalImages) {
        product.additionalImages.forEach(img => {
          initialLoadState[img] = false;
        });
      }
      
      setImagesLoaded(initialLoadState);
    }
  }, [product]);

  const handleImageLoad = (imageUrl: string) => {
    setImagesLoaded(prev => ({
      ...prev,
      [imageUrl]: true
    }));
  };

  if (isLoading) {
    return (
      <div className="md:w-1/2">
        <Skeleton className="aspect-square w-full rounded-lg mb-4" />
        <div className="flex space-x-4 mt-4">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="w-16 h-16 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="md:w-1/2">
      <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden mb-4 relative">
        {!imagesLoaded[selectedImage] && (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={addCacheBusting(selectedImage)} 
          alt={`Primary image of ${product.title}`}
          className={`w-full h-full object-center object-contain transition-opacity duration-300 ${imagesLoaded[selectedImage] ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => handleImageLoad(selectedImage)}
        />
      </div>
      
      {/* Thumbnail gallery */}
      {product.additionalImages && product.additionalImages.length > 0 && (
        <div className="flex space-x-4 mt-4" role="region" aria-label="Product image gallery">
          <button 
            className={`cursor-pointer border-2 rounded-md overflow-hidden ${
              selectedImage === product.imageUrl ? 'border-indigo-500' : 'border-transparent'
            }`}
            onClick={() => setSelectedImage(product.imageUrl)}
            aria-label="View main product image"
            aria-pressed={selectedImage === product.imageUrl}
            title="View main product image"
            type="button"
          >
            <div className="relative w-16 h-16">
              {!imagesLoaded[product.imageUrl] && (
                <Skeleton className="absolute inset-0" aria-hidden="true" />
              )}
              <img 
                src={addCacheBusting(product.imageUrl)} 
                alt=""
                aria-hidden="true"
                className={`w-16 h-16 object-cover transition-opacity duration-300 ${imagesLoaded[product.imageUrl] ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => handleImageLoad(product.imageUrl)}
              />
            </div>
          </button>
          
          {product.additionalImages.map((image, index) => (
            <button 
              key={index}
              className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                selectedImage === image ? 'border-indigo-500' : 'border-transparent'
              }`}
              onClick={() => setSelectedImage(image)}
              aria-label={`View product image ${index + 1}`}
              aria-pressed={selectedImage === image}
              title={`View product image ${index + 1}`}
              type="button"
            >
              <div className="relative w-16 h-16">
                {!imagesLoaded[image] && (
                  <Skeleton className="absolute inset-0" aria-hidden="true" />
                )}
                <img 
                  src={addCacheBusting(image)} 
                  alt=""
                  aria-hidden="true"
                  className={`w-16 h-16 object-cover transition-opacity duration-300 ${imagesLoaded[image] ? 'opacity-100' : 'opacity-0'}`}
                  loading="lazy"
                  onLoad={() => handleImageLoad(image)}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
