
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseProductToProduct } from '@/services/products/mappers';
import { Product } from '@/services/products/types';

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit = 6): Promise<Product[]> => {
  try {
    // Perform a simplified query to avoid TypeScript deep inference issues
    const response = await supabase
      .from('products')
      .select('*')
      .eq('attributes->bestSeller', 'true')
      .order('rating', { ascending: false })
      .limit(limit);
    
    // Explicitly handle the response data
    if (response.error) {
      console.error('Error fetching featured products:', response.error);
      return [];
    }
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    // Process each product individually with explicit typing
    const products: Product[] = [];
    
    for (const item of response.data) {
      try {
        // Map to final Product type
        const product = mapSupabaseProductToProduct(item);
        products.push(product);
      } catch (err) {
        console.error('Error processing product:', err);
      }
    }
    
    return products;
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
};
