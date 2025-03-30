
import { Product } from '@/services/productService';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseProductToProduct } from '@/services/products/mappers';

// Format price with currency symbol
export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(numPrice);
};

// Generate URL for a product
export const getProductUrl = (product: Product): string => {
  if (!product) return '/products';
  
  if (product.slug) {
    return `/products/${product.slug}`;
  }
  
  return `/products/${product.id}`;
};

// Get category name from slug
export const getCategoryName = (categorySlug: string): string => {
  // Capitalize each word and replace hyphens with spaces
  return categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get products by category slug
export const getProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
  try {
    // First, get the category ID from the slug
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    
    if (categoryError || !categoryData) {
      console.error('Error fetching category by slug:', categoryError || 'Category not found');
      return [];
    }
    
    const categoryId = categoryData.id;
    
    // Now get all products with this category_id
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId);
    
    if (productsError) {
      console.error('Error fetching products by category ID:', productsError);
      return [];
    }
    
    // Map the Supabase products to our Product type
    return productsData.map(product => mapSupabaseProductToProduct(product));
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return [];
  }
};

// Get products by subcategory
export const getProductsBySubcategory = async (categorySlug: string, subcategorySlug: string): Promise<Product[]> => {
  try {
    // First, get all products from this category
    const categoryProducts = await getProductsByCategory(categorySlug);
    
    // Filter the products that match the subcategory slug
    // In our database structure, we store subcategory as a string in the product data
    return categoryProducts.filter(product => {
      // Get the subcategory slug from the product
      const productSubcategorySlug = product.subcategory?.toLowerCase().replace(/\s+/g, '-');
      return productSubcategorySlug === subcategorySlug;
    });
  } catch (error) {
    console.error('Error in getProductsBySubcategory:', error);
    return [];
  }
};

// Get featured products
export const getFeaturedProducts = async (limit: number = 6): Promise<Product[]> => {
  try {
    // First try to get products marked as bestSeller
    const { data: featuredData, error: featuredError } = await supabase
      .rpc('get_featured_products');
    
    if (featuredError) {
      console.error('Error fetching featured products:', featuredError);
      // Fallback to regular query
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('rating', { ascending: false })
        .limit(limit);
      
      if (productsError) {
        console.error('Error with fallback products query:', productsError);
        return [];
      }
      
      return productsData.map(product => mapSupabaseProductToProduct(product));
    }
    
    return featuredData.map(product => mapSupabaseProductToProduct(product));
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
};

// Get related products based on category
export const getRelatedProducts = async (productId: string | number, categoryId: string | number, limit: number = 4): Promise<Product[]> => {
  try {
    // Get products from the same category, excluding the current product
    const { data: relatedData, error: relatedError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId.toString())
      .neq('id', productId.toString())
      .order('rating', { ascending: false })
      .limit(limit);
    
    if (relatedError) {
      console.error('Error fetching related products:', relatedError);
      return [];
    }
    
    return relatedData.map(product => mapSupabaseProductToProduct(product));
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    return [];
  }
};

// Get products for comparison
export const getProductsForComparison = async (productIds: string[]): Promise<Product[]> => {
  try {
    if (!productIds.length) return [];
    
    // Get products by IDs for comparison
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);
    
    if (productsError) {
      console.error('Error fetching products for comparison:', productsError);
      return [];
    }
    
    return productsData.map(product => mapSupabaseProductToProduct(product));
  } catch (error) {
    console.error('Error in getProductsForComparison:', error);
    return [];
  }
};
