
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getProducts, Product } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';
import { localStorageKeys } from '@/lib/constants';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    loadWishlistItems();
  }, []);
  
  const loadWishlistItems = async () => {
    try {
      setIsLoading(true);
      
      // Get saved product IDs from localStorage
      const savedProductIds = JSON.parse(localStorage.getItem(localStorageKeys.WISHLIST_ITEMS) || '[]');
      
      if (savedProductIds.length === 0) {
        setWishlistItems([]);
        setIsLoading(false);
        return;
      }
      
      // Get all products
      const allProducts = await getProducts();
      
      // Filter products that are in the wishlist
      const wishlistProducts = allProducts.filter(product => 
        savedProductIds.includes(product.id)
      );
      
      setWishlistItems(wishlistProducts);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to load your wishlist items",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeFromWishlist = async (productId: number) => {
    try {
      setIsPending(true);
      
      // Get current saved items
      const savedItems = JSON.parse(localStorage.getItem(localStorageKeys.WISHLIST_ITEMS) || '[]');
      
      // Remove the product
      const updatedItems = savedItems.filter((id: number) => id !== productId);
      
      // Save back to localStorage
      localStorage.setItem(localStorageKeys.WISHLIST_ITEMS, JSON.stringify(updatedItems));
      
      // Update state
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      
      toast({
        title: "Item removed",
        description: "Item has been removed from your wishlist"
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive"
      });
    } finally {
      setIsPending(false);
    }
  };
  
  const clearWishlist = async () => {
    try {
      setIsPending(true);
      
      // Clear wishlist in localStorage
      localStorage.setItem(localStorageKeys.WISHLIST_ITEMS, JSON.stringify([]));
      
      // Update state
      setWishlistItems([]);
      
      toast({
        title: "Wishlist cleared",
        description: "All items have been removed from your wishlist"
      });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to clear wishlist",
        variant: "destructive"
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Your Wishlist</h1>
            
            {wishlistItems.length > 0 && (
              <Button 
                variant="outline"
                className="text-gray-600"
                onClick={() => clearWishlist()}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border rounded-lg overflow-hidden bg-white">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map(product => (
                <div key={product.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <Link to={`/products/${product.slug}`} className="block">
                    <div className="h-48 bg-gray-100 p-4 flex items-center justify-center">
                      <img 
                        src={product.imageUrl} 
                        alt={product.title}
                        className="max-h-full object-contain"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <Link to={`/products/${product.slug}`} className="block">
                      <h2 className="font-semibold text-gray-900 mb-1 hover:text-indigo-600 transition-colors">
                        {product.title}
                      </h2>
                    </Link>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex text-amber-400 mr-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(product.rating) ? "★" : 
                            i === Math.floor(product.rating) && product.rating % 1 > 0 ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-gray-500 line-through ml-2">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <a 
                        href={product.affiliateUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="default" className="w-full">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Buy Now
                        </Button>
                      </a>
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => removeFromWishlist(product.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Browse our products and save your favorites to keep track of items you're interested in.
              </p>
              <Link to="/">
                <Button>
                  Explore Products
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
