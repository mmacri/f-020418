
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from './types';
import { mapSupabaseProductToProduct, mapProductToSupabaseProduct } from './mappers';

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  try {
    const supabaseProduct = mapProductToSupabaseProduct(product);
    
    const { data, error } = await supabase
      .from('products')
      .insert([supabaseProduct])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
      return null;
    }
    
    toast.success('Product added successfully');
    return mapSupabaseProductToProduct(data);
  } catch (error) {
    console.error('Error in addProduct:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
};

export const createProduct = addProduct;

export const updateProduct = async (id: number | string, product: Partial<Product>): Promise<Product | null> => {
  try {
    const supabaseProduct = mapProductToSupabaseProduct({
      ...product,
      id: id
    });
    
    delete supabaseProduct.id; // Remove id from update payload
    
    const { data, error } = await supabase
      .from('products')
      .update(supabaseProduct)
      .eq('id', id.toString())
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      return null;
    }
    
    toast.success('Product updated successfully');
    return mapSupabaseProductToProduct(data);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
};

export const deleteProduct = async (id: number | string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id.toString());
    
    if (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
      return false;
    }
    
    toast.success('Product deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    toast.error('An unexpected error occurred');
    return false;
  }
};
