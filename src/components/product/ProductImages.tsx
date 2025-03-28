
import React, { useState } from 'react';
import { Product } from '@/services/productService';

interface ProductImagesProps {
  product: Product;
}

const ProductImages: React.FC<ProductImagesProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.imageUrl);

  return (
    <div className="md:w-1/2">
      <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden mb-4">
        <img 
          src={selectedImage} 
          alt={product.title}
          className="w-full h-full object-center object-contain"
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
              className="w-16 h-16 object-cover"
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
                className="w-16 h-16 object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
