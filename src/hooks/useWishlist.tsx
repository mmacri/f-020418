
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { isAuthenticated } from '@/services/userService';
import { Product } from '@/services/productService';

// For development, we'll use localStorage
// In production, this would call a real API
const saveWishlistToStorage = (productIds: number[]) => {
  localStorage.setItem('savedProducts', JSON.stringify(productIds));
};

const getWishlistFromStorage = (): number[] => {
  try {
    return JSON.parse(localStorage.getItem('savedProducts') || '[]');
  } catch (error) {
    console.error("Error parsing wishlist from storage:", error);
    return [];
  }
};

export const useWishlist = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isLoggedIn = isAuthenticated();

  // Fetch wishlist items
  const { data: wishlistItems, isLoading } = useQuery<Product[]>({
    queryKey: ['savedProducts'],
    queryFn: async () => {
      if (!isLoggedIn) return [];
      
      try {
        // In production, this would be a real API call
        // For now, we'll use localStorage
        const productIds = getWishlistFromStorage();
        
        if (productIds.length === 0) return [];
        
        // Fetch details for each product
        const products = await Promise.all(
          productIds.map(id => api.get<Product>(`/products/${id}`))
        );
        
        return products.filter(Boolean); // Filter out any null results
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
      }
    },
    enabled: isLoggedIn
  });

  // Check if product is in wishlist
  const isInWishlist = (productId: number): boolean => {
    const productIds = getWishlistFromStorage();
    return productIds.includes(productId);
  };

  // Add to wishlist
  const addToWishlist = useMutation({
    mutationFn: async (productId: number) => {
      if (!isLoggedIn) {
        throw new Error("User not authenticated");
      }
      
      // In production, this would be a real API call
      try {
        const productIds = getWishlistFromStorage();
        
        if (!productIds.includes(productId)) {
          productIds.push(productId);
          saveWishlistToStorage(productIds);
        }
        
        return { success: true, productId };
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        throw error;
      }
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ['savedProducts'] });
      queryClient.invalidateQueries({ queryKey: ['savedProduct', productId] });
      
      toast({
        title: "Added to Wishlist",
        description: "Product has been added to your wishlist"
      });
    },
    onError: () => {
      if (!isLoggedIn) {
        toast({
          title: "Login Required",
          description: "Please login to add products to your wishlist",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "There was an error adding to your wishlist",
          variant: "destructive"
        });
      }
    }
  });

  // Remove from wishlist
  const removeFromWishlist = useMutation({
    mutationFn: async (productId: number) => {
      if (!isLoggedIn) {
        throw new Error("User not authenticated");
      }
      
      // In production, this would be a real API call
      try {
        const productIds = getWishlistFromStorage();
        const updatedIds = productIds.filter(id => id !== productId);
        saveWishlistToStorage(updatedIds);
        
        return { success: true, productId };
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        throw error;
      }
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ['savedProducts'] });
      queryClient.invalidateQueries({ queryKey: ['savedProduct', productId] });
      
      toast({
        title: "Removed from Wishlist",
        description: "Product has been removed from your wishlist"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error updating your wishlist",
        variant: "destructive"
      });
    }
  });

  // Clear wishlist
  const clearWishlist = useMutation({
    mutationFn: async () => {
      if (!isLoggedIn) {
        throw new Error("User not authenticated");
      }
      
      // In production, this would be a real API call
      try {
        saveWishlistToStorage([]);
        return { success: true };
      } catch (error) {
        console.error("Error clearing wishlist:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedProducts'] });
      queryClient.invalidateQueries({ queryKey: ['savedProduct'] });
      
      toast({
        title: "Wishlist Cleared",
        description: "All products have been removed from your wishlist"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error clearing your wishlist",
        variant: "destructive"
      });
    }
  });

  return {
    wishlistItems: wishlistItems || [],
    isLoading,
    isInWishlist: (productId: number): boolean => {
      const productIds = getWishlistFromStorage();
      return productIds.includes(productId);
    },
    addToWishlist: (productId: number) => addToWishlist.mutate(productId),
    removeFromWishlist: (productId: number) => removeFromWishlist.mutate(productId),
    clearWishlist: () => clearWishlist.mutate(),
    isPending: addToWishlist.isPending || removeFromWishlist.isPending || clearWishlist.isPending
  };
};
