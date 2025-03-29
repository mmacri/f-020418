
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/services/productService';

// Import the ProductImage type from ProductCard's props
type ProductImage = {
  url: string;
};

// Define the props expected by ProductCard to ensure type compatibility
type ProductCardProps = {
  id: string | number;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: ProductImage[];
  // Add other required fields that might be in the ProductCard's props
  categoryId?: number;
  createdAt?: string;
  updatedAt?: string;
};

interface FeaturedProductsSectionProps {
  products: Product[];
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ products }) => {
  // Transform products to the format expected by ProductCard
  const transformedProducts = products.map(product => {
    // Create a new object with all properties except images
    const { images, ...productProps } = product;
    
    // Return a new object with transformed images and ensure it matches ProductCard's expected format
    return {
      ...productProps,
      images: images.map(img => ({ url: img }))
    };
  });

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Featured Recovery Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {transformedProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              featured={true} 
            />
          ))}
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
