
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/services/productService';

// Define a modified version of the Product type that has the correct image structure for ProductCard
interface ProductCardProps {
  product: {
    id: string | number;
    name: string;
    slug: string;
    category: string;
    description: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    images: { url: string }[];
  };
  isLoading?: boolean;
  featured?: boolean;
}

interface FeaturedProductsSectionProps {
  products: Product[];
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ products }) => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Featured Recovery Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => {
            // Create a new object that conforms to what ProductCard expects
            const transformedProduct = {
              id: product.id,
              name: product.name,
              slug: product.slug,
              category: product.category,
              description: product.description,
              price: product.price,
              originalPrice: product.comparePrice || product.originalPrice,
              rating: product.rating,
              reviewCount: product.reviewCount,
              images: product.images.map(img => ({ url: img }))
            };
            
            return (
              <ProductCard 
                key={product.id} 
                product={transformedProduct} 
                featured={true} 
              />
            );
          })}
        </div>
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/categories/massage-guns">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
