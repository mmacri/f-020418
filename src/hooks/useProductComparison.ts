
import { useState, useEffect } from 'react';
import { Product } from '@/services/products/types';
import { getProducts } from '@/services/products';
import { getProductsByCategory } from '@/lib/products';
import { getCategoryBySlug } from '@/services/categoryService';

interface UseProductComparisonProps {
  category?: string;
  productIds?: string[];
}

export const useProductComparison = ({ category, productIds = [] }: UseProductComparisonProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let productsToCompare: Product[] = [];
        
        // If productIds are provided in the URL
        if (productIds.length > 0) {
          const allProducts = await getProducts();
          productsToCompare = allProducts.filter(p => 
            productIds.includes(p.id.toString()) || productIds.includes(p.slug)
          );
        } 
        // If category is provided
        else if (category) {
          const categoryData = await getCategoryBySlug(category);
          if (categoryData) {
            setCategoryName(categoryData.name);
            const categoryProducts = await getProductsByCategory(category);
            // Sort by rating to show best products first
            productsToCompare = (categoryProducts as Product[])
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5); // Limit to top 5
          }
        }
        // Default fallback - just get some products
        else {
          const allProducts = await getProducts();
          productsToCompare = allProducts
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
        }
        
        setProducts(productsToCompare);
      } catch (error) {
        console.error('Error fetching products for comparison:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [category, productIds]);

  return {
    products,
    isLoading,
    categoryName,
  };
};
