
import React from 'react';
import ProductCard from '@/components/ProductCard';

interface HomeFeaturedProductsProps {
  products: any[];
}

const HomeFeaturedProducts: React.FC<HomeFeaturedProductsProps> = ({ products }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Featured Products</h2>
        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Discover our hand-picked selection of the highest-rated recovery tools that deliver exceptional results.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} featured={true} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFeaturedProducts;
