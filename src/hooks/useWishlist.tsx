
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthentication } from '@/hooks/useAuthentication';
import { toast } from 'sonner';
import { trackAffiliateClick } from '@/lib/analytics-utils';

type WishlistItem = {
  id: string;
  asin?: string;
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  images?: string[];
};

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  isPending: boolean;
  addToWishlist: (productId: string | number) => Promise<void>;
  removeFromWishlist: (productId: string | number) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string | number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const { isAuthenticated, user } = useAuthentication();

  // Convert product ID to string for consistent handling
  const formatProductId = (productId: string | number): string => {
    return String(productId);
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const fetchWishlistItems = async () => {
    try {
      setIsLoading(true);
      
      // Make sure the user is authenticated
      if (!user?.id) {
        setWishlistItems([]);
        return;
      }
      
      // First, get all wishlist items for the user
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', user.id);
      
      if (wishlistError) throw wishlistError;
      
      if (!wishlistData.length) {
        setWishlistItems([]);
        setIsLoading(false);
        return;
      }
      
      // Extract product IDs
      const productIds = wishlistData.map(item => item.product_id);
      
      // Then, fetch product details for each product in the wishlist
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);
      
      if (productsError) throw productsError;
      
      setWishlistItems(productsData || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load your wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (productId: string | number) => {
    try {
      setIsPending(true);
      
      // Make sure the user is authenticated
      if (!user?.id) {
        toast.error('Please login to add items to your wishlist');
        return;
      }
      
      const formattedProductId = formatProductId(productId);
      
      // Check if the product exists
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('id, name')
        .eq('id', formattedProductId)
        .single();
      
      if (productError || !productData) {
        toast.error('Product not found');
        return;
      }
      
      // Add to wishlist
      const { error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          product_id: formattedProductId
        });
      
      if (error) {
        // Check if it's a duplicate error (constraint violation)
        if (error.code === '23505') {
          toast.info('This product is already in your wishlist');
        } else {
          throw error;
        }
      } else {
        toast.success('Added to wishlist');
        
        // Track the wishlist add event
        trackAffiliateClick(
          formattedProductId,
          productData.name,
          'wishlist-add',
          'wishlist'
        );
        
        // Refresh wishlist items
        await fetchWishlistItems();
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    } finally {
      setIsPending(false);
    }
  };

  const removeFromWishlist = async (productId: string | number) => {
    try {
      setIsPending(true);
      
      // Make sure the user is authenticated
      if (!user?.id) return;
      
      const formattedProductId = formatProductId(productId);
      
      // Remove from wishlist
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', formattedProductId);
      
      if (error) throw error;
      
      toast.success('Removed from wishlist');
      
      // Update local state
      setWishlistItems(prev => prev.filter(item => formatProductId(item.id) !== formattedProductId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    } finally {
      setIsPending(false);
    }
  };

  const clearWishlist = async () => {
    try {
      setIsPending(true);
      
      // Make sure the user is authenticated
      if (!user?.id) return;
      
      // Clear wishlist
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success('Wishlist cleared');
      
      // Update local state
      setWishlistItems([]);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    } finally {
      setIsPending(false);
    }
  };

  const isInWishlist = (productId: string | number): boolean => {
    const formattedProductId = formatProductId(productId);
    return wishlistItems.some(item => formatProductId(item.id) === formattedProductId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isLoading,
        isPending,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
