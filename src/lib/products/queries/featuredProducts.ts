
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/services/products/types';

/**
 * Get featured products
 * @param limit - Optional number of products to return (default: 4)
 */
export const getFeaturedProducts = async (limit: number = 4): Promise<Product[]> => {
  try {
    // Use simpler query with explicit path access
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .filter('attributes->>bestSeller', 'eq', 'true')
      .limit(limit);

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }

    return data as Product[];
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
};
