import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseProductToProduct } from '@/services/products/mappers';
import { Product, SupabaseProduct } from '@/services/products/types';
import { Json } from '@/integrations/supabase/types';

/**
 * Format a price for display
 */
export const formatPrice = (price?: number): string => {
  if (price === undefined || price === null) {
    return '$0.00';
  }
  return `$${price.toFixed(2)}`;
};

/**
 * Get the URL for a product
 */
export const getProductUrl = (product: Product): string => {
  return `/products/${product.slug}`;
};

/**
 * Get a category name from its slug
 */
export const getCategoryName = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

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
        const typedProduct: SupabaseProduct = {
          ...product,
          specifications: product.specifications as Json,
          attributes: product.attributes as Json
        };
        const mappedProduct = mapSupabaseProductToProduct(typedProduct);
        result.push(mappedProduct);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return [];
  }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit = 6): Promise<Product[]> => {
  try {
    // Use type assertion to any to break the deep type inference
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('best_seller', true)
      .order('rating', { ascending: false })
      .limit(limit) as { data: any[], error: any };
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Process each product individually to avoid complex type inference
    const result: Product[] = [];
    
    for (let i = 0; i < data.length; i++) {
      try {
        // Create a simplified intermediate product with required fields only
        const supabaseProduct: SupabaseProduct = {
          id: data[i].id,
          name: data[i].name,
          slug: data[i].slug,
          description: data[i].description,
          price: data[i].price,
          sale_price: data[i].sale_price,
          original_price: data[i].original_price,
          rating: data[i].rating,
          review_count: data[i].review_count,
          image_url: data[i].image_url,
          images: data[i].images,
          in_stock: data[i].in_stock,
          best_seller: data[i].best_seller,
          featured: data[i].featured,
          is_new: data[i].is_new,
          category: data[i].category,
          category_id: data[i].category_id,
          subcategory: data[i].subcategory,
          subcategory_slug: data[i].subcategory_slug,
          // Explicitly cast to Json to avoid type recursion
          specifications: data[i].specifications as Json,
          attributes: data[i].attributes as Json,
          features: data[i].features,
          pros: data[i].pros,
          cons: data[i].cons,
          affiliate_url: data[i].affiliate_url,
          asin: data[i].asin,
          brand: data[i].brand,
          availability: data[i].availability,
          created_at: data[i].created_at,
          updated_at: data[i].updated_at
        };
        
        // Map to the final Product type
        const product = mapSupabaseProductToProduct(supabaseProduct);
        result.push(product);
      } catch (err) {
        console.error('Error processing product:', err);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
};
