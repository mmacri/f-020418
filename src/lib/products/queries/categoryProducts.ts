
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseProductToProduct } from '@/services/products/mappers';
import { Product } from '@/services/products/types';
import { Json } from '@/integrations/supabase/types';

/**
 * Get all products for a category
 */
export const getProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
  try {
    // Get the category ID
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    
    if (categoryError || !categoryData) {
      console.error('Error fetching category:', categoryError);
      return [];
    }
    
    // Get products with matching category ID
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryData.id)
      .order('id');
    
    if (productsError) {
      console.error('Error fetching products for category:', productsError);
      return [];
    }
    
    // Use explicit loop instead of map to avoid type recursion issues
    const result: Product[] = [];
    
    if (productsData && productsData.length > 0) {
      for (let i = 0; i < productsData.length; i++) {
        const product = productsData[i];
        // Create a typed intermediate object to avoid recursion
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
    console.error('Error in getProductsByCategory:', error);
    return [];
  }
};
