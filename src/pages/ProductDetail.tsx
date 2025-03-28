
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Share2, ShoppingCart, Check, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductReviews from '@/components/product/ProductReviews';
import SaveForLater from '@/components/product/SaveForLater';
import ProductSkeleton from '@/components/product/ProductSkeleton';
import { api } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/services/productService';

const ProductDetail = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch product data with proper typing
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', productSlug],
    queryFn: () => api.get<Product>(`/products/${productSlug}`),
    enabled: !!productSlug
  });

  const handleBuyNow = () => {
    if (!product) return;
    
    // Track click for analytics
    console.log('Buy Now clicked:', product.title);
    
    // Open affiliate link in new tab
    window.open(product.affiliateUrl, '_blank');
    
    // Show toast notification
    toast({
      title: "Opening Amazon",
      description: "You're being redirected to complete your purchase"
    });
  };

  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.title,
        text: `Check out this product: ${product.title}`,
        url: window.location.href
      })
      .then(() => {
        console.log('Shared successfully');
      })
      .catch((error) => {
        console.log('Error sharing:', error);
        // Fallback for browsers that don't support navigator.share
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Product link copied to clipboard"
        });
      });
    } else if (product) {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <ProductSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
              <p className="text-gray-500 mb-8">
                Sorry, we couldn't find the product you're looking for.
              </p>
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Set the first image as selected if none is selected
  if (!selectedImage && product.imageUrl) {
    setSelectedImage(product.imageUrl);
  }

  // Calculate discount percentage
  const discountPercentage = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          <nav className="flex text-sm mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1">
              <li>
                <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <a href={`/categories/${product.category}`} className="ml-1 text-gray-500 hover:text-gray-700">
                  {product.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </a>
              </li>
              {product.subcategory && (
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <a 
                    href={`/categories/${product.category}/${product.subcategory}`} 
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    {product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1)}
                  </a>
                </li>
              )}
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="ml-1 text-gray-900 font-medium" aria-current="page">
                  {product.title}
                </span>
              </li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Images */}
            <div className="md:w-1/2">
              <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden mb-4">
                <img 
                  src={selectedImage || product.imageUrl} 
                  alt={product.title}
                  className="w-full h-full object-center object-contain"
                />
              </div>
              
              {/* Thumbnail gallery */}
              {product.additionalImages && product.additionalImages.length > 0 && (
                <div className="flex space-x-4 mt-4">
                  <div 
                    className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                      selectedImage === product.imageUrl ? 'border-indigo-500' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(product.imageUrl)}
                  >
                    <img 
                      src={product.imageUrl} 
                      alt={`${product.title} - main`}
                      className="w-16 h-16 object-cover"
                    />
                  </div>
                  
                  {product.additionalImages.map((image, index) => (
                    <div 
                      key={index}
                      className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                        selectedImage === image ? 'border-indigo-500' : 'border-transparent'
                      }`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        src={image} 
                        alt={`${product.title} - ${index + 1}`}
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="md:w-1/2">
              {product.bestSeller && (
                <div className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md mb-2">
                  #1 Best Seller
                </div>
              )}
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-amber-400 mr-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(product.rating) ? "★" : 
                       i === Math.floor(product.rating) && product.rating % 1 > 0 ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <span className="text-gray-600 text-sm">{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
              </div>
              
              <div className="mb-6">
                <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                {discountPercentage && (
                  <>
                    <span className="text-gray-500 line-through ml-2">${product.originalPrice!.toFixed(2)}</span>
                    <span className="text-green-600 ml-2">Save {discountPercentage}%</span>
                  </>
                )}
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  {product.shortDescription || product.description.substring(0, 150) + '...'}
                </p>
              </div>
              
              <div className="mb-6 flex items-center">
                <span className={`inline-flex items-center ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? (
                    <>
                      <Check className="h-5 w-5 mr-1" />
                      In Stock
                    </>
                  ) : (
                    <>
                      <span className="h-5 w-5 mr-1">✕</span>
                      Out of Stock
                    </>
                  )}
                </span>
              </div>
              
              <div className="mb-8 flex space-x-4">
                <Button 
                  className="flex items-center"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy on Amazon
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
                
                <SaveForLater 
                  productId={product.id} 
                  productName={product.title}
                />
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="rounded-full"
                  aria-label="Share"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-3">About this item</h3>
                {product.features && product.features.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">{product.description}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Tabs for Description, Specs, Reviews */}
          <div className="mt-16">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="p-6 border rounded-lg mt-4">
                <h2 className="text-xl font-bold mb-4">Product Description</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{product.description}</p>
                  
                  {product.features && product.features.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {product.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="p-6 border rounded-lg mt-4">
                <h2 className="text-xl font-bold mb-4">Technical Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Product Details</h3>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-500">Brand</td>
                          <td className="py-2 text-gray-900 font-medium">{product.title.split(' ')[0]}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-500">Model</td>
                          <td className="py-2 text-gray-900 font-medium">{product.title.split(' ').slice(1, 3).join(' ')}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-500">Category</td>
                          <td className="py-2 text-gray-900 font-medium">
                            {product.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-500">ASIN</td>
                          <td className="py-2 text-gray-900 font-medium">{product.asin}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Shipping & Returns</h3>
                    <p className="text-gray-700 mb-4 text-sm">
                      This product is fulfilled by Amazon. Free delivery on eligible orders and easy returns within 30 days of receipt.
                    </p>
                    <Button 
                      variant="link" 
                      className="text-indigo-600 p-0 h-auto text-sm"
                      onClick={handleBuyNow}
                    >
                      View shipping details on Amazon
                      <ArrowUpRight className="ml-1 h-3 w-3 inline" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                <ProductReviews 
                  productId={product.id}
                  productSlug={product.slug}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
