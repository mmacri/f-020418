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
    // Break the type inference by using `any` at the Supabase client call level
    const { data, error } = await (supabase
      .from('products')
      .select('*')
      .eq('best_seller', true)
      .order('rating', { ascending: false })
      .limit(limit) as any);
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Process each product individually to avoid complex type inference
    const result: Product[] = [];
    
    for (const rawProduct of data) {
      try {
        // Create a completely isolated typed object without relying on TS inference
        const productData = {
          id: rawProduct.id,
          name: rawProduct.name,
          slug: rawProduct.slug,
          description: rawProduct.description,
          price: rawProduct.price,
          sale_price: rawProduct.sale_price,
          original_price: rawProduct.original_price,
          rating: rawProduct.rating,
          review_count: rawProduct.review_count,
          image_url: rawProduct.image_url,
          images: rawProduct.images,
          in_stock: rawProduct.in_stock,
          best_seller: rawProduct.best_seller,
          featured: rawProduct.featured,
          is_new: rawProduct.is_new,
          category: rawProduct.category,
          category_id: rawProduct.category_id,
          subcategory: rawProduct.subcategory,
          subcategory_slug: rawProduct.subcategory_slug,
          features: rawProduct.features,
          pros: rawProduct.pros,
          cons: rawProduct.cons,
          affiliate_url: rawProduct.affiliate_url,
          asin: rawProduct.asin,
          brand: rawProduct.brand,
          availability: rawProduct.availability,
          created_at: rawProduct.created_at,
          updated_at: rawProduct.updated_at
        };
        
        // Manually construct a SupabaseProduct with explicit typing
        // This breaks any possible type recursion by creating a fresh object
        const supabaseProduct: SupabaseProduct = {
          id: productData.id,
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          price: productData.price,
          sale_price: productData.sale_price,
          original_price: productData.original_price,
          rating: productData.rating,
          review_count: productData.review_count,
          image_url: productData.image_url,
          images: productData.images,
          in_stock: productData.in_stock,
          best_seller: productData.best_seller,
          featured: productData.featured,
          is_new: productData.is_new,
          category: productData.category,
          category_id: productData.category_id,
          subcategory: productData.subcategory,
          subcategory_slug: productData.subcategory_slug,
          // Use double casting to completely break type inference chain
          specifications: rawProduct.specifications as any as Json,
          attributes: rawProduct.attributes as any as Json,
          features: productData.features,
          pros: productData.pros,
          cons: productData.cons,
          affiliate_url: productData.affiliate_url,
          asin: productData.asin,
          brand: productData.brand,
          availability: productData.availability,
          created_at: productData.created_at,
          updated_at: productData.updated_at
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
