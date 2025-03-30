
import { supabase } from '@/integrations/supabase/client';
import { Product } from './types';
import { getCategoryBySlug } from '@/services/categoryService';
import { mapSupabaseProductToProduct } from './mappers';

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data.map(product => mapSupabaseProductToProduct(product));
  } catch (error) {
    console.error('Error in getProducts:', error);
    return [];
  }
};

// Get product by slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (error || !data) {
      console.error('Error fetching product by slug:', error);
      return null;
    }
    
    // Get category information
    let categoryName = '';
    if (data.category_id) {
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('name, slug')
        .eq('id', data.category_id)
        .maybeSingle();
      
      if (!categoryError && categoryData) {
        categoryName = categoryData.slug;
      }
    }
    
    const product = mapSupabaseProductToProduct(data);
    product.category = categoryName;
    
    return product;
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return null;
  }
};

// Create new product
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        short_description: productData.shortDescription,
        price: productData.price,
        original_price: productData.originalPrice,
        rating: productData.rating,
        review_count: productData.reviewCount,
        image_url: productData.imageUrl,
        images: productData.images,
        in_stock: productData.inStock,
        category_id: productData.categoryId,
        subcategory_slug: productData.subcategory,
        specifications: productData.specifications,
        features: productData.features,
        pros: productData.pros,
        cons: productData.cons,
        best_seller: productData.bestSeller,
        affiliate_url: productData.affiliateUrl,
        asin: productData.asin,
        brand: productData.brand
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    
    return mapSupabaseProductToProduct(data);
  } catch (error) {
    console.error('Error in createProduct:', error);
    return null;
  }
};

// Update existing product
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        short_description: productData.shortDescription,
        price: productData.price,
        original_price: productData.originalPrice,
        rating: productData.rating,
        review_count: productData.reviewCount,
        image_url: productData.imageUrl,
        images: productData.images,
        in_stock: productData.inStock,
        category_id: productData.categoryId,
        subcategory_slug: productData.subcategory,
        specifications: productData.specifications,
        features: productData.features,
        pros: productData.pros,
        cons: productData.cons,
        best_seller: productData.bestSeller,
        affiliate_url: productData.affiliateUrl,
        asin: productData.asin,
        brand: productData.brand
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      return null;
    }
    
    return mapSupabaseProductToProduct(data);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return null;
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return false;
  }
};

// Search products
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

// Export types
export * from './types';
export { mapSupabaseProductToProduct, mapProductToSupabaseProduct } from './mappers';
