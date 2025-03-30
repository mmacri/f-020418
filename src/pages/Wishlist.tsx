import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '@/lib/images';
import { formatPrice } from '@/lib/product-utils';
import { handleAffiliateClick } from '@/lib/affiliate-utils';
import { extractImageUrl } from '@/services/products/mappers';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, isPending, isLoading } = useWishlist();
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
          
          {isLoading ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading your wishlist...</p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <h2 className="text-xl font-medium mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Browse our products and add items to your wishlist for easy access later.
              </p>
              <Link to="/">
                <Button>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
                </p>
                <Button
                  variant="outline"
                  onClick={() => clearWishlist()}
                  disabled={isPending}
                  className="text-sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Wishlist
                </Button>
              </div>
              
              <div className="space-y-4">
                {wishlistItems.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-1/4 p-4">
                        <Link to={`/products/${product.slug}`}>
                          <ImageWithFallback
                            src={extractImageUrl(product.images?.[0])}
                            alt={product.name}
                            className="w-full h-40 object-contain"
                            type="product"
                          />
                        </Link>
                      </div>
                      <div className="w-full sm:w-3/4 p-4 flex flex-col">
                        <div className="flex-grow">
                          <Link to={`/products/${product.slug}`}>
                            <h2 className="text-xl font-bold mb-2 hover:text-indigo-600 transition-colors">
                              {product.name}
                            </h2>
                          </Link>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {product.shortDescription || product.description?.substring(0, 150)}...
                          </p>
                          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {product.asin && (
                            <Button
                              onClick={() => 
                                handleAffiliateClick(
                                  `https://www.amazon.com/dp/${product.asin}?tag=recoveryessentials-20`,
                                  product.id,
                                  product.name,
                                  product.asin,
                                  '/wishlist'
                                )
                              }
                              className="bg-amber-500 hover:bg-amber-600"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              View on Amazon
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => removeFromWishlist(product.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Wishlist;
