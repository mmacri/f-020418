
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseProductToProduct } from '@/services/products/mappers';
import { Product } from '@/services/products/types';

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit = 6): Promise<Product[]> => {
  try {
    // Cast the query result to a simpler type to avoid deep type inference
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('best_seller', true)
      .order('rating', { ascending: false })
      .limit(limit) as { data: any[] | null; error: any };
    
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
