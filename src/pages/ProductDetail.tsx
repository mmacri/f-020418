
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Check, AlertCircle, ShoppingCart, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product, getProductBySlug } from "@/services/productService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogPostCard from "@/components/BlogPostCard";
import { getBlogPosts } from "@/services/blogService";

const ProductDetail = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) return;
      
      try {
        setLoading(true);
        const productData = await getProductBySlug(productSlug);
        
        if (productData) {
          setProduct(productData);
          setSelectedImage(productData.imageUrl);
          
          // Fetch related blog posts
          const allPosts = await getBlogPosts();
          const related = allPosts.filter(post => 
            post.tags?.some(tag => 
              productData.title.toLowerCase().includes(tag.toLowerCase()) ||
              productData.category.toLowerCase().includes(tag.toLowerCase())
            )
          ).slice(0, 3);
          
          setRelatedPosts(related);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to load product");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    // Track click in analytics
    console.log(`Affiliate link clicked for ${product.title}`);
    
    // Open the affiliate link in a new tab
    window.open(product.affiliateUrl, '_blank');
    
    toast({
      title: "Redirecting to retailer",
      description: "You're being redirected to purchase this product",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 flex-grow flex justify-center items-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 flex-grow">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">{error || "The product you're looking for doesn't exist or has been removed."}</p>
            <Link to="/products" className="bg-indigo-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-indigo-700">
              Browse Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="text-sm text-gray-600">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/categories/${product.category}`} className="hover:text-indigo-600">
              {product.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.title}</span>
          </div>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
            {/* Product Images */}
            <div className="lg:col-span-1">
              <div className="mb-4 rounded-lg overflow-hidden border">
                <img 
                  src={selectedImage || product.imageUrl} 
                  alt={product.title}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {product.additionalImages && product.additionalImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  <div 
                    className={`cursor-pointer rounded-md overflow-hidden border-2 ${selectedImage === product.imageUrl ? 'border-indigo-500' : 'border-gray-200'}`}
                    onClick={() => handleImageClick(product.imageUrl)}
                  >
                    <img src={product.imageUrl} alt={product.title} className="w-full h-auto" />
                  </div>
                  
                  {product.additionalImages.map((img, index) => (
                    <div 
                      key={index}
                      className={`cursor-pointer rounded-md overflow-hidden border-2 ${selectedImage === img ? 'border-indigo-500' : 'border-gray-200'}`}
                      onClick={() => handleImageClick(img)}
                    >
                      <img src={img} alt={`${product.title} - view ${index + 1}`} className="w-full h-auto" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 text-gray-900">{product.title}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className="w-5 h-5" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <>
                        <span className="ml-2 text-lg text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                        <span className="ml-2 text-sm font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">
                          Save {product.discount}%
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-2 flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={product.inStock ? 'text-green-700' : 'text-red-700'}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {product.bestSeller && (
                      <span className="ml-4 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                        Best Seller
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700">{product.shortDescription || product.description.slice(0, 150) + '...'}</p>
                </div>
                
                {product.features && product.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Key Features:</h3>
                    <ul className="space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto flex items-center justify-center"
                    onClick={handleBuyNow}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Buy on Amazon
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto flex items-center justify-center"
                    onClick={handleBuyNow}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" /> View on Retailer
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 mt-4">
                  As an Amazon Associate, we earn from qualifying purchases. 
                  <Link to="/affiliate-disclosure" className="text-indigo-600 hover:underline ml-1">
                    Learn more
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <div className="border-t">
            <div className="p-6">
              <Tabs defaultValue="description">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="specs">Specifications</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="prose max-w-none">
                  <p>{product.description}</p>
                </TabsContent>
                
                <TabsContent value="specs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 font-medium">Product Details</div>
                      <div className="divide-y">
                        <div className="px-4 py-3 grid grid-cols-2">
                          <span className="text-gray-600">Brand</span>
                          <span className="font-medium">{product.title.split(' ')[0]}</span>
                        </div>
                        <div className="px-4 py-3 grid grid-cols-2">
                          <span className="text-gray-600">Category</span>
                          <span className="font-medium">
                            {product.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                        </div>
                        {product.subcategory && (
                          <div className="px-4 py-3 grid grid-cols-2">
                            <span className="text-gray-600">Type</span>
                            <span className="font-medium">
                              {product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1)}
                            </span>
                          </div>
                        )}
                        <div className="px-4 py-3 grid grid-cols-2">
                          <span className="text-gray-600">ASIN</span>
                          <span className="font-medium">{product.asin}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 font-medium">Pricing</div>
                      <div className="divide-y">
                        <div className="px-4 py-3 grid grid-cols-2">
                          <span className="text-gray-600">Current Price</span>
                          <span className="font-medium">${product.price.toFixed(2)}</span>
                        </div>
                        {product.originalPrice && (
                          <>
                            <div className="px-4 py-3 grid grid-cols-2">
                              <span className="text-gray-600">Original Price</span>
                              <span className="font-medium">${product.originalPrice.toFixed(2)}</span>
                            </div>
                            <div className="px-4 py-3 grid grid-cols-2">
                              <span className="text-gray-600">Discount</span>
                              <span className="font-medium text-green-600">{product.discount}% off</span>
                            </div>
                          </>
                        )}
                        <div className="px-4 py-3 grid grid-cols-2">
                          <span className="text-gray-600">Availability</span>
                          <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <div className="text-center py-8">
                    <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>
                    <div className="flex justify-center items-center mb-4">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className="w-5 h-5" />
                        ))}
                      </div>
                      <span className="text-gray-700">{product.rating.toFixed(1)} out of 5</span>
                    </div>
                    <p className="text-gray-600 mb-6">{product.reviewCount} global ratings</p>
                    
                    <div className="max-w-xl mx-auto mb-8">
                      <p className="text-gray-700 mb-4">Reviews are loaded directly from the retailer and are not stored on our site.</p>
                      <Button onClick={handleBuyNow}>
                        Read Reviews on Retailer Site
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Blog Posts */}
      {relatedPosts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post, index) => (
              <BlogPostCard key={index} post={post} />
            ))}
          </div>
        </section>
      )}
      
      {/* Recommended Products */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* This would fetch from an API in a real implementation */}
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img 
                  src={`https://ext.same-assets.com/1001010${127 + index}/product-${index + 1}.jpg`}
                  alt="Related product" 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">Related Product {index + 1}</h3>
                <div className="flex items-center mt-1">
                  <div className="flex text-yellow-400 mr-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} fill={i < 4 ? "currentColor" : "none"} className="w-3 h-3" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-xs">4.0 (120)</span>
                </div>
                <div className="mt-2 font-bold">$199.99</div>
                <button className="mt-2 w-full text-center py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
