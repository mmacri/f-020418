
import React, { useState, useEffect } from 'react';
import { Product } from '@/services/productService';

interface ProductImagesProps {
  product: Product;
}

const ProductImages: React.FC<ProductImagesProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.imageUrl);
  const [imagesLoaded, setImagesLoaded] = useState<{[key: string]: boolean}>({});

  // Initialize imagesLoaded state
  useEffect(() => {
    const initialLoadState: {[key: string]: boolean} = { [product.imageUrl]: false };
    
    if (product.additionalImages) {
      product.additionalImages.forEach(img => {
        initialLoadState[img] = false;
      });
    }
    
    setImagesLoaded(initialLoadState);
  }, [product.imageUrl, product.additionalImages]);

  const handleImageLoad = (imageUrl: string) => {
    setImagesLoaded(prev => ({
      ...prev,
      [imageUrl]: true
    }));
  };

  return (
    <div className="md:w-1/2">
      <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden mb-4 relative">
        {!imagesLoaded[selectedImage] && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={selectedImage} 
          alt={product.title}
          className={`w-full h-full object-center object-contain transition-opacity duration-300 ${imagesLoaded[selectedImage] ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => handleImageLoad(selectedImage)}
        />
      </div>
      
      {/* Thumbnail gallery */}
      {product.additionalImages && product.additionalImages.length > 0 && (
        <div className="flex space-x-4 mt-4">
          <div 
            className={`cursor-pointer border-2 rounded-md overflow-hidden ${
              selectedImage === product.imageUrl ? 'border-indigo-500' : 'border-transparent'
            }`}
            onClick={() => setSelectedImage(product.imageUrl)}
          >
            <img 
              src={product.imageUrl} 
              alt={`${product.title} - main`}
              className={`w-16 h-16 object-cover transition-opacity duration-300 ${imagesLoaded[product.imageUrl] ? 'opacity-100' : 'opacity-20'}`}
              loading="lazy"
              onLoad={() => handleImageLoad(product.imageUrl)}
            />
          </div>
          
          {product.additionalImages.map((image, index) => (
            <div 
              key={index}
              className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                selectedImage === image ? 'border-indigo-500' : 'border-transparent'
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <img 
                src={image} 
                alt={`${product.title} - ${index + 1}`}
                className={`w-16 h-16 object-cover transition-opacity duration-300 ${imagesLoaded[image] ? 'opacity-100' : 'opacity-20'}`}
                loading="lazy"
                onLoad={() => handleImageLoad(image)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
