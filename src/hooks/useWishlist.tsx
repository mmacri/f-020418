
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthentication } from '@/hooks/useAuthentication';
import { Product } from '@/services/products';

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthentication();
  
  // Fetch wishlist items
  const { data: wishlistItems, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (!isAuthenticated || !user) return [];
      
      try {
        // Fetch wishlist items with product details in a single query
        const { data, error } = await supabase
          .from('wishlists')
          .select(`
            id,
            product_id,
            created_at,
            products:product_id (*)
          `)
          .eq('user_id', user.id);
        
        if (error) {
          console.error("Error fetching wishlist:", error);
          return [];
        }
        
        // Map the data to the expected format
        return data.map(item => mapSupabaseProductToProduct(item.products));
      } catch (error) {
        console.error("Error in wishlist query:", error);
        return [];
      }
    },
    enabled: isAuthenticated && !!user
  });

  // Check if product is in wishlist
  const isInWishlist = (productId: string | number): boolean => {
    if (!wishlistItems) return false;
    return wishlistItems.some(item => item.id.toString() === productId.toString());
  };

  // Add to wishlist
  const addToWishlist = useMutation({
    mutationFn: async (productId: string | number) => {
      if (!isAuthenticated || !user) {
        throw new Error("User not authenticated");
      }
      
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            product_id: productId.toString()
          })
          .select();
          
        if (error) {
          if (error.code === '23505') { // Unique violation
            return { success: true, message: "Product already in wishlist" };
          }
          throw error;
        }
        
        return { success: true, data };
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success("Product added to wishlist");
    },
    onError: (error) => {
      console.error("Wishlist add error:", error);
      if (!isAuthenticated) {
        toast.error("Please login to add products to your wishlist");
      } else {
        toast.error("Failed to add product to wishlist");
      }
    }
  });

  // Remove from wishlist
  const removeFromWishlist = useMutation({
    mutationFn: async (productId: string | number) => {
      if (!isAuthenticated || !user) {
        throw new Error("User not authenticated");
      }
      
      try {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId.toString());
          
        if (error) {
          throw error;
        }
        
        return { success: true };
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success("Product removed from wishlist");
    },
    onError: () => {
      toast.error("Failed to remove product from wishlist");
    }
  });

  // Clear wishlist
  const clearWishlist = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated || !user) {
        throw new Error("User not authenticated");
      }
      
      try {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        return { success: true };
      } catch (error) {
        console.error("Error clearing wishlist:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success("Wishlist cleared");
    },
    onError: () => {
      toast.error("Failed to clear wishlist");
    }
  });

  // Helper function to map Supabase product to our Product interface
  const mapSupabaseProductToProduct = (productData: any): Product => {
    if (!productData) {
      return {
        id: 'unknown',
        slug: 'unknown',
        name: 'Unknown Product',
        description: '',
        price: 0,
        rating: 0,
        reviewCount: 0,
        imageUrl: '',
        inStock: false,
        category: '',
      };
    }
    
    return {
      id: productData.id,
      slug: productData.slug || 'unknown',
      name: productData.name || 'Unnamed Product',
      description: productData.description || '',
      price: productData.price || 0,
      originalPrice: productData.sale_price || undefined,
      rating: productData.rating || 0,
      reviewCount: productData.attributes?.reviewCount || 0,
      imageUrl: productData.image_url || '',
      images: productData.image_url ? [productData.image_url] : [],
      inStock: productData.in_stock !== false,
      category: productData.attributes?.category || '',
      categoryId: productData.category_id,
      specifications: productData.specifications || {},
      createdAt: productData.created_at,
      updatedAt: productData.updated_at,
      pros: Array.isArray(productData.attributes?.pros) ? productData.attributes.pros : []
    };
  };

  return {
    wishlistItems: wishlistItems || [],
    isLoading,
    isInWishlist,
    addToWishlist: (productId: string | number) => addToWishlist.mutate(productId),
    removeFromWishlist: (productId: string | number) => removeFromWishlist.mutate(productId),
    clearWishlist: () => clearWishlist.mutate(),
    isPending: addToWishlist.isPending || removeFromWishlist.isPending || clearWishlist.isPending
  };
};
