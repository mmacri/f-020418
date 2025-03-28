
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug } from '@/services/productService';
import { getCategoryBySlug } from '@/services/categoryService';
import MainLayout from '@/components/layouts/MainLayout';
import { Loader2, Star, ShoppingCart, Heart, Share2, Info, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import ProductCard from '@/components/ProductCard';
import { trackAffiliateClick } from '@/lib/affiliate-utils';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [category, setCategory] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (slug) {
          const productData = await getProductBySlug(slug);
          setProduct(productData);
          
          if (productData) {
            setSelectedImage(productData.images[0] || '');
            
            // Get category information
            if (productData.category) {
              const categorySlug = productData.category.toLowerCase().replace(/\s+/g, '-');
              const categoryData = await getCategoryBySlug(categorySlug);
              setCategory(categoryData);
            }
            
            // Fetch 3 related products from the same category
            if (productData.categoryId) {
              const allProducts = await getProductByCategory(productData.categoryId);
              const filtered = allProducts.filter(p => p.id !== productData.id).slice(0, 3);
              setRelatedProducts(filtered);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const getProductByCategory = async (categoryId: number) => {
    // This function would be part of your productService.ts
    // For now, implementing simplified logic here
    const allProducts = await fetch('/api/products').then(res => res.json());
    return allProducts.filter((p: any) => p.categoryId === categoryId);
  };

  const handleBuyNow = () => {
    if (product && product.affiliateLink) {
      trackAffiliateClick(product.id, product.name);
      window.open(product.affiliateLink, '_blank');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading product information...</p>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Create breadcrumb data
  const breadcrumbs = [
    { name: 'Home', url: '/' },
  ];
  
  if (category) {
    breadcrumbs.push({
      name: category.name,
      url: `/categories/${category.slug}`
    });
    
    // Add subcategory if present
    if (product.subcategory) {
      const subcategoryData = category.subcategories.find(
        (sub: any) => sub.name.toLowerCase() === product.subcategory.toLowerCase()
      );
      
      if (subcategoryData) {
        breadcrumbs.push({
          name: subcategoryData.name,
          url: `/categories/${category.slug}/${subcategoryData.slug}`
        });
      }
    }
  }
  
  // Add product name as last breadcrumb
  breadcrumbs.push({
    name: product.name,
    url: `/products/${product.slug}`
  });

  return (
    <MainLayout>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-2">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-gray-600">
            {breadcrumbs.map((crumb, index) => (
              <span key={index}>
                {index > 0 && <span className="mx-2">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-gray-900">{crumb.name}</span>
                ) : (
                  <Link to={crumb.url} className="hover:text-indigo-600">{crumb.name}</Link>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images */}
          <div className="md:w-1/2">
            <div className="mb-4 overflow-hidden rounded-lg">
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="w-full h-auto object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img: string, idx: number) => (
                <div 
                  key={idx} 
                  className={`border rounded-md overflow-hidden cursor-pointer transition-all ${selectedImage === img ? 'border-indigo-500 ring-2 ring-indigo-300' : 'border-gray-200'}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`${product.name} ${idx+1}`} className="w-full h-auto" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Ratings */}
            <div className="flex items-center mb-3">
              <div className="flex items-center mr-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) 
                        ? "fill-amber-500 text-amber-500" 
                        : "text-gray-300"
                    }`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating}/5 ({product.reviewCount} reviews)
              </span>
            </div>
            
            {/* Price */}
            <div className="mb-4">
              <div className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</div>
              {product.comparePrice && (
                <div className="text-sm line-through text-gray-500">
                  RRP: ${product.comparePrice.toFixed(2)}
                </div>
              )}
              {product.comparePrice && (
                <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                  Save ${(product.comparePrice - product.price).toFixed(2)} 
                  ({Math.round((1 - product.price/product.comparePrice) * 100)}% off)
                </div>
              )}
            </div>
            
            {/* Short Description */}
            <div className="mb-6">
              <p className="text-gray-700">{product.shortDescription || product.description.substring(0, 200) + '...'}</p>
            </div>
            
            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                <ul className="space-y-1">
                  {product.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Availability */}
            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">Availability:</span>
                {product.inStock !== false ? (
                  <span className="text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" /> In Stock
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" /> Out of Stock
                  </span>
                )}
              </div>
              {product.brand && (
                <div className="text-gray-700 mt-1">Brand: <span className="font-medium">{product.brand}</span></div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={handleBuyNow} 
                size="lg" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                View on Amazon
              </Button>
              
              <div className="flex space-x-3">
                <Button variant="outline" size="sm" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Save to Wishlist
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Product
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mt-12 border-t pt-8">
          <Tabs defaultValue="description">
            <TabsList className="mb-6">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">Product Description</h2>
              <div className="mb-8">
                {product.description.split('\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              {/* How to Use Section */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold mb-3">How to Use</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Unpack the {product.name} and check all components are present.</li>
                  <li>Charge the device fully before first use (if applicable).</li>
                  <li>Select the appropriate attachment for your needs.</li>
                  <li>Start on the lowest setting and gradually increase intensity as needed.</li>
                  <li>Use for 2-5 minutes per muscle group, 2-3 times per day as needed.</li>
                </ol>
              </div>
              
              {/* Benefits Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3">Benefits</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Accelerates muscle recovery and reduces soreness</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Improves blood circulation to muscle tissues</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Reduces muscle tension and improves flexibility</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Helps prepare muscles before workouts</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications">
              <h2 className="text-2xl font-bold mb-4">Product Specifications</h2>
              <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    {product.specifications ? (
                      Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                        <tr key={key}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                            {key}
                          </td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-600">
                            {value}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                            Dimensions
                          </td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-600">
                            Varies based on model
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                            Weight
                          </td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-600">
                            Approx. 1-2 lbs
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                            Battery Life
                          </td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-600">
                            Up to 4 hours of continuous use
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                            Material
                          </td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-600">
                            High-quality ABS plastic and silicone
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Customer Reviews</h2>
                <Button variant="outline">Write a Review</Button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-1/3 bg-gray-50 p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{product.rating}</div>
                  <div className="flex justify-center mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-6 w-6 ${
                          i < Math.floor(product.rating) 
                            ? "fill-amber-500 text-amber-500" 
                            : "text-gray-300"
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="text-gray-600">{product.reviewCount} reviews</div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="space-y-6">
                    {/* Sample reviews - could be populated from an API */}
                    <div className="border-b pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < 5 ? "fill-amber-500 text-amber-500" : "text-gray-300"}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">Verified Purchase</span>
                      </div>
                      <h3 className="font-bold mb-1">Excellent recovery tool!</h3>
                      <p className="text-sm text-gray-600 mb-2">By Sarah J. on May 12, 2023</p>
                      <p className="text-gray-700">
                        This has been a game-changer for my post-workout recovery. I use it daily and have noticed a significant reduction in muscle soreness.
                      </p>
                    </div>
                    
                    <div className="border-b pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < 4 ? "fill-amber-500 text-amber-500" : "text-gray-300"}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">Verified Purchase</span>
                      </div>
                      <h3 className="font-bold mb-1">Good but battery could be better</h3>
                      <p className="text-sm text-gray-600 mb-2">By Michael T. on April 3, 2023</p>
                      <p className="text-gray-700">
                        The product works great for relieving muscle tension, but I find the battery doesn't last as long as advertised. Still, I would recommend it.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < 5 ? "fill-amber-500 text-amber-500" : "text-gray-300"}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">Verified Purchase</span>
                      </div>
                      <h3 className="font-bold mb-1">Worth every penny</h3>
                      <p className="text-sm text-gray-600 mb-2">By Chris L. on March 15, 2023</p>
                      <p className="text-gray-700">
                        I was hesitant due to the price, but this has exceeded my expectations. The different attachments are versatile and the build quality is excellent.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="faqs">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    How often should I use this product?
                  </AccordionTrigger>
                  <AccordionContent>
                    We recommend using the product for 2-5 minutes per muscle group, 2-3 times per day as needed. Always start with the lowest intensity setting and gradually increase as comfortable.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    Is this product suitable for beginners?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, this product is designed for users of all experience levels. The adjustable intensity settings allow beginners to start with gentle settings and progress as they become more comfortable.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    How long does the battery last?
                  </AccordionTrigger>
                  <AccordionContent>
                    The battery typically lasts 2-4 hours on a full charge, depending on the intensity setting used. A full charge takes approximately 2 hours.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    Can I use this product if I have medical conditions?
                  </AccordionTrigger>
                  <AccordionContent>
                    If you have any medical conditions, are pregnant, or have concerns about using this product, please consult with your healthcare provider before use.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">
                    What is the warranty period?
                  </AccordionTrigger>
                  <AccordionContent>
                    This product comes with a standard 1-year manufacturer's warranty against defects in materials and workmanship under normal use.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
        
        {/* Disclaimer */}
        <div className="mt-16 border-t pt-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                <strong>Affiliate Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases. When you buy through links on our site, we may earn an affiliate commission at no additional cost to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
