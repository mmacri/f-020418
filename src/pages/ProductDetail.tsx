
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductReviews from '@/components/product/ProductReviews';
import ProductSkeleton from '@/components/product/ProductSkeleton';
import Breadcrumbs from '@/components/product/Breadcrumbs';
import BreadcrumbsSkeleton from '@/components/product/BreadcrumbsSkeleton';
import ProductImages from '@/components/product/ProductImages';
import ProductImagesSkeleton from '@/components/product/ProductImagesSkeleton';
import ProductInfo from '@/components/product/ProductInfo';
import ProductInfoSkeleton from '@/components/product/ProductInfoSkeleton';
import ProductDescription from '@/components/product/ProductDescription';
import ProductSpecifications from '@/components/product/ProductSpecifications';
import ProductInquiryForm from '@/components/product/ProductInquiryForm';
import { api } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/services/productService';

const ProductDetail = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const { toast } = useToast();

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

  if (error) {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          {isLoading ? <BreadcrumbsSkeleton /> : product && <Breadcrumbs product={product} />}
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Images */}
            {isLoading ? <ProductImagesSkeleton /> : product && <ProductImages product={product} />}
            
            {/* Product Info */}
            {isLoading ? <ProductInfoSkeleton /> : product && (
              <ProductInfo 
                product={product} 
                onShare={handleShare} 
                onBuyNow={handleBuyNow} 
              />
            )}
          </div>
          
          {/* Tabs for Description, Specs, Reviews */}
          <div className="mt-16">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            ) : product && (
              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="p-6 border rounded-lg mt-4">
                  <ProductDescription product={product} />
                </TabsContent>
                
                <TabsContent value="specifications" className="p-6 border rounded-lg mt-4">
                  <h2 className="text-xl font-bold mb-4">Technical Specifications</h2>
                  <ProductSpecifications product={product} onBuyNow={handleBuyNow} />
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-4">
                  <ProductReviews 
                    productId={product.id}
                    productSlug={product.slug}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
          
          {/* Product Inquiry Form */}
          {!isLoading && product && (
            <ProductInquiryForm 
              productName={product.title} 
              productId={product.id} 
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
