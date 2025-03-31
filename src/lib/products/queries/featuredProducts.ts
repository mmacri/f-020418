
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseProductToProduct } from '@/services/products/mappers';
import { Product, SupabaseProduct } from '@/services/products/types';
import { Json } from '@/integrations/supabase/types';

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit = 6): Promise<Product[]> => {
  try {
    // Break the type chain completely by using explicit typing
    interface BasicResponse {
      data: Record<string, any>[] | null;
      error: any;
    }
    
    // Use as unknown to break the deep inference chain
    const response = await supabase
      .from('products')
      .select('*')
      .eq('best_seller', true)
      .order('rating', { ascending: false })
      .limit(limit) as unknown as BasicResponse;
      
    const { data, error } = response;
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Process each product individually with explicit typing
    const result: Product[] = [];
    
    for (const item of data) {
      try {
        // Create a simple intermediate object without nested types
        const rawProduct: Record<string, any> = item;
        
        // Manually construct the product with explicit types
        const supabaseProduct: SupabaseProduct = {
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
          // Break the deep type inference with explicit casting
          specifications: rawProduct.specifications as unknown as Json,
          attributes: rawProduct.attributes as unknown as Json,
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
        
        // Map to final Product type
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
