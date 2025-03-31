
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseProductToProduct } from '@/services/products/mappers';
import { Product } from '@/services/products/types';

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit = 6): Promise<Product[]> => {
  try {
    // Bypass TypeScript's deep type inference completely
    const query = supabase
      .from('products')
      .select('*')
      .eq('best_seller', true)
      .order('rating', { ascending: false })
      .limit(limit);
      
    // Perform the query and immediately cast to a simple type
    const result = await query;
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
    const result: Product[] = [];
    
    for (const item of data) {
      try {
        // Cast each item to any to break type inference
        const rawProduct = item as any;
        
        // Map to final Product type
        const product = mapSupabaseProductToProduct(rawProduct);
        result.push(product);
      } catch (err) {
        console.error('Error processing product:', err);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
};
