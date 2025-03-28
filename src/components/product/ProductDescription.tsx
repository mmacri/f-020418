
import React from 'react';
import { Product } from '@/services/productService';

interface ProductDescriptionProps {
  product: Product;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Product Description</h2>
      <div className="prose max-w-none">
        <p className="text-gray-700">{product.description}</p>
        
        {product.features && product.features.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Key Features</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
