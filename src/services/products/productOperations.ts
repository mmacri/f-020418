
import { supabase } from '@/integrations/supabase/client';
import { Product, SupabaseProduct } from './types';
import { mapProductToSupabaseProduct, mapSupabaseProductToProduct } from './mappers';

/**
 * Create a new product in the database
 */
export const createProduct = async (product: Product): Promise<Product> => {
  try {
    const supabaseProduct = mapProductToSupabaseProduct(product);
    
    if (!supabaseProduct.name || !supabaseProduct.slug) {
      throw new Error('Product name and slug are required');
    }
    
    // Need to cast to any to avoid TypeScript errors with Supabase types
    const { data, error } = await supabase
      .from('products')
      .insert(supabaseProduct as any)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
    
    return mapSupabaseProductToProduct(data);
  } catch (error) {
    console.error('Error in createProduct:', error);
    throw error;
  }
};

/**
 * Update an existing product in the database
 */
export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  try {
    const supabaseProduct = mapProductToSupabaseProduct(product);
    
    const { data, error } = await supabase
      .from('products')
      .update(supabaseProduct as any)
      .eq('id', id.toString())
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating product ${id}:`, error);
      throw new Error('Failed to update product');
    }
    
    return mapSupabaseProductToProduct(data);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id.toString());
      
    if (error) {
      console.error('Error deleting product:', error);
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw error;
  }
};
