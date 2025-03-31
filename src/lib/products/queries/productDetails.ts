
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseProductToProduct } from '@/services/products/mappers';
import { Product } from '@/services/products/types';
import { Json } from '@/integrations/supabase/types';

/**
 * Get a product by its slug
 */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error fetching product by slug:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return mapSupabaseProductToProduct({
      ...data,
      specifications: data.specifications as Json,
      attributes: data.attributes as Json
    });
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return null;
  }
};

/**
 * Get related products for a product
 */
export const getRelatedProducts = async (product: Product, limit = 4): Promise<Product[]> => {
  try {
    if (!product.categoryId) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', product.categoryId)
      .neq('id', product.id)
      .limit(limit);
    
    if (error) {
      console.error('Error fetching related products:', error);
      return [];
    }
    
    // Use explicit for loop instead of map to avoid type recursion issues
    const result: Product[] = [];
    
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const product = data[i];
        const mappedProduct = mapSupabaseProductToProduct({
          ...product,
          specifications: product.specifications as Json,
          attributes: product.attributes as Json
        });
        result.push(mappedProduct);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    return [];
  }
};
