
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Product } from '@/services/productService';

interface BreadcrumbsProps {
  product: Product;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ product }) => {
  return (
    <nav className="flex text-sm mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        <li>
          <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
        </li>
        <li className="flex items-center">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <a href={`/categories/${product.category}`} className="ml-1 text-gray-500 hover:text-gray-700">
            {product.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </a>
        </li>
        {product.subcategory && (
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <a 
              href={`/categories/${product.category}/${product.subcategory}`} 
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              {product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1)}
            </a>
          </li>
        )}
        <li className="flex items-center">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="ml-1 text-gray-900 font-medium" aria-current="page">
            {product.title}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
