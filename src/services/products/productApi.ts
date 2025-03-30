
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from './types';
import { mapSupabaseProductToProduct, mapProductToSupabaseProduct } from './mappers';
import { generateMockProducts } from './mockData';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching products from Supabase:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      const products: Product[] = [];
      
      // Use standard for loop to avoid type recursion
      for (let i = 0; i < data.length; i++) {
        try {
          // Use explicit casting to avoid deep inference
          const product = mapSupabaseProductToProduct(data[i]);
          products.push(product);
        } catch (err) {
          console.error('Error mapping product:', err, data[i]);
        }
      }
      
      return products;
    }
    
    return generateMockProducts();
  } catch (error) {
    console.error('Error in getProducts:', error);
    return generateMockProducts();
  }
};

export const getProductById = async (id: number | string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id.toString())
      .single();
    
    if (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
    
    return mapSupabaseProductToProduct(data);
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
};

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
    
    return mapSupabaseProductToProduct(data);
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return null;
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();
      
    if (categoryData) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryData.id)
        .order('id');
      
      if (error) {
        console.error('Error fetching products by category:', error);
        return [];
      }
      
      return data.map(product => mapSupabaseProductToProduct(product));
    }
    
    return [];
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return [];
  }
};

export const getProductsBySubcategory = async (category: string, subcategory: string): Promise<Product[]> => {
  try {
    const products = await getProductsByCategory(category);
    
    return products.filter(
      product => product.subcategory?.toLowerCase() === subcategory.toLowerCase()
    );
  } catch (error) {
    console.error('Error in getProductsBySubcategory:', error);
    return [];
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    if (!query.trim()) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('rating', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error searching products:', error);
      return [];
    }
    
    return data.map(product => mapSupabaseProductToProduct(product));
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return [];
  }
};
