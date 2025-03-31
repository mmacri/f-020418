
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseProductToProduct } from '@/services/products/mappers';
import { Product } from '@/services/products/types';
import { Json } from '@/integrations/supabase/types';

/**
 * Get all products for a subcategory
 */
export const getProductsBySubcategory = async (categorySlug: string, subcategorySlug: string): Promise<Product[]> => {
  try {
    // Step 1: Get the category ID
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    
    if (categoryError || !categoryData) {
      console.error('Error fetching category:', categoryError);
      return [];
    }
    
    // Step 2: Get the subcategory ID
    const { data: subcategoryData, error: subcategoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', subcategorySlug)
      .eq('parent_id', categoryData.id)
      .single();
      
    if (subcategoryError || !subcategoryData) {
      console.error('Error fetching subcategory:', subcategoryError);
      return [];
    }
    
    // Step 3: Get products with matching subcategory
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryData.id)
      .contains('attributes', { subcategory: subcategorySlug });
    
    if (productsError) {
      console.error('Error fetching products for subcategory:', productsError);
      return [];
    }
    
    // Use explicit for loop instead of map to avoid type recursion issues
    const result: Product[] = [];
    
    if (products && products.length > 0) {
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
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
    console.error('Error in getProductsBySubcategory:', error);
    return [];
  }
};
