
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/services/productService';

interface FeaturedProductsSectionProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  maxProducts?: number;
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ 
  products,
  title = "Featured Recovery Products",
  subtitle,
  viewAllLink = "/categories/massage-guns",
  viewAllText = "View All Products",
  maxProducts = 6
}) => {
  // Display only the specified max number of products
  const displayedProducts = products.slice(0, maxProducts);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-foreground">{title}</h2>
        
        {subtitle && (
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              featured={true} 
            />
          ))}
        </div>
        
        {viewAllLink && (
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to={viewAllLink}>
                {viewAllText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
