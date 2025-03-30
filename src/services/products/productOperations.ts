
import { supabase } from '@/integrations/supabase/client';
import { Product } from './types';
import { mapSupabaseProductToProduct, mapProductToSupabaseProduct } from './mappers';

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  try {
    const supabaseProduct = mapProductToSupabaseProduct(productData);
    
    const { data, error } = await supabase
      .from('products')
      .insert([supabaseProduct])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating product:', error);
      throw new Error(`Failed to create product: ${error.message}`);
    }
    
    return mapSupabaseProductToProduct(data);
  } catch (error) {
    console.error('Error in createProduct:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  try {
    const supabaseProduct = mapProductToSupabaseProduct(productData);
    
    const { data, error } = await supabase
      .from('products')
      .update(supabaseProduct)
      .eq('id', id.toString())
      .select()
      .single();
      
    if (error) {
      console.error('Error updating product:', error);
      throw new Error(`Failed to update product: ${error.message}`);
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
