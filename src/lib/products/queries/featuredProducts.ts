
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseProductToProduct } from '@/services/products/mappers';
import { Product } from '@/services/products/types';

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit = 6): Promise<Product[]> => {
  try {
    // Use a non-generic approach to avoid TypeScript's deep inference issues
    const result = await supabase
      .from('products')
      .select('*')
      .eq('attributes->bestSeller', 'true') // Using the JSON path syntax for nested attributes
      .order('rating', { ascending: false })
      .limit(limit);
      
    // Type the result manually after the query
    const data = result.data as any[] | null;
    const error = result.error;
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Process each product individually with explicit typing
    const products: Product[] = [];
    
    for (const item of data) {
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
