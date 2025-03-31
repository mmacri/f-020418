
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/services/products/types';

/**
 * Get featured products
 */
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    // Use simpler query with explicit path access
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .filter('attributes->>bestSeller', 'eq', 'true')
      .limit(4);

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
