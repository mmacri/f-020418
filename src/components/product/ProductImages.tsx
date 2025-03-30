
import React, { useState, useEffect } from 'react';
import { Product } from '@/services/productService';
import { Skeleton } from '@/components/ui/skeleton';
import { localStorageKeys } from '@/lib/constants';
import { extractImageUrl } from '@/services/products/mappers';

interface ProductImagesProps {
  product: Product;
  isLoading?: boolean;
}

const FALLBACK_IMAGE = '/placeholder.svg';
const DEFAULT_IMAGE = 'https://static.vecteezy.com/system/resources/previews/021/573/353/non_2x/arm-muscle-silhouette-logo-biceps-icon-free-vector.jpg';

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
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const [useLocalFallback, setUseLocalFallback] = useState<boolean>(false);

  // Initialize selected image and imagesLoaded state when product data changes
  useEffect(() => {
    if (product && product.imageUrl) {
      setSelectedImage(product.imageUrl);
      
      const initialLoadState: {[key: string]: boolean} = { [product.imageUrl]: false };
      
      // Check if product has images array
      if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
          const imgUrl = extractImageUrl(img);
          initialLoadState[imgUrl] = false;
        });
      }
      
      setImagesLoaded(initialLoadState);
      
      // Check if we should use local fallback
      const useLocal = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
      setUseLocalFallback(useLocal);
    }
  }, [product]);

  const handleImageLoad = (imageUrl: string) => {
    setImagesLoaded(prev => ({
      ...prev,
      [imageUrl]: true
    }));
  };

  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => ({
      ...prev,
      [imageUrl]: true
    }));
    
    // If it's the selected image, switch to fallback
    if (imageUrl === selectedImage) {
      const fallbackImg = useLocalFallback ? FALLBACK_IMAGE : DEFAULT_IMAGE;
      setSelectedImage(fallbackImg);
    }
  };

  const getImageSrc = (imageUrl: string) => {
    if (imageErrors[imageUrl]) {
      return useLocalFallback ? FALLBACK_IMAGE : DEFAULT_IMAGE;
    }
    return addCacheBusting(imageUrl);
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

  // Get all images for the product
  const allImages = product.images && product.images.length > 0 ? 
    product.images.map(img => extractImageUrl(img)) : 
    (product.imageUrl ? [product.imageUrl] : []);

  return (
    <div className="md:w-1/2">
      <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden mb-4 relative">
        {!imagesLoaded[selectedImage] && !imageErrors[selectedImage] && (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={getImageSrc(selectedImage)} 
          alt={`Primary image of ${product.title}`}
          className={`w-full h-full object-center object-contain transition-opacity duration-300 ${imagesLoaded[selectedImage] || imageErrors[selectedImage] ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => handleImageLoad(selectedImage)}
          onError={() => handleImageError(selectedImage)}
        />
      </div>
      
      {/* Thumbnail gallery */}
      {allImages.length > 1 && (
        <div className="flex space-x-4 mt-4" role="region" aria-label="Product image gallery">
          {allImages.map((image, index) => (
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
                {!imagesLoaded[image] && !imageErrors[image] && (
                  <Skeleton className="absolute inset-0" aria-hidden="true" />
                )}
                <img 
                  src={getImageSrc(image)} 
                  alt=""
                  aria-hidden="true"
                  className={`w-16 h-16 object-cover transition-opacity duration-300 ${
                    imagesLoaded[image] || imageErrors[image] ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  onLoad={() => handleImageLoad(image)}
                  onError={() => handleImageError(image)}
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
