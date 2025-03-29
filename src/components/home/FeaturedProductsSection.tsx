
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/services/productService';

// Define the ProductImage type to match what ProductCard expects
type ProductImage = {
  url: string;
};

// Define the type that ProductCard expects
interface ProductCardData {
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
  categoryId?: number;
  createdAt?: string;
  updatedAt?: string;
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
            // Transform product data to match what ProductCard expects
            const productCardData: ProductCardData = {
              id: product.id,
              name: product.name,
              slug: product.slug,
              category: product.category,
              description: product.description,
              price: product.price,
              originalPrice: product.originalPrice,
              rating: product.rating,
              reviewCount: product.reviewCount,
              images: product.images.map(img => ({ url: img })),
              categoryId: product.categoryId,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt
            };
            
            return (
              <ProductCard 
                key={product.id} 
                product={productCardData} 
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
