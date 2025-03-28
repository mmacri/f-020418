
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import CategoryHero from '@/components/CategoryHero';
import FeaturedProduct from '@/components/FeaturedProduct';
import ProductComparison from '@/components/ProductComparison';
import VideoSection from '@/components/VideoSection';
import { getProductsByCategory } from '@/lib/product-utils';
import { Button } from '@/components/ui/button';
import { 
  getCategoryBySlug, 
  getSubcategoryBySlug 
} from '@/services/categoryService';
import { getCategoryContentBySlug, CategoryContent } from '@/services/categoryContentService';
import { Loader2, CheckCircle, ShoppingCart, ArrowRight, Star } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';

const CategoryPage = () => {
  const { categorySlug, subSlug } = useParams<{ categorySlug: string; subSlug: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryContent, setCategoryContent] = useState<CategoryContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<any>(null);
  const [subcategory, setSubcategory] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Get category information
        if (categorySlug) {
          const categoryData = await getCategoryBySlug(categorySlug);
          setCategory(categoryData);
          
          // If we have a subcategory slug, get that info
          if (subSlug && categoryData) {
            const subcategoryData = await getSubcategoryBySlug(categorySlug, subSlug);
            setSubcategory(subcategoryData?.subcategory || null);
          } else {
            setSubcategory(null);
          }
          
          // Get products for this category or subcategory
          const categoryProducts = categorySlug ? getProductsByCategory(categorySlug, subSlug) : [];
          setProducts(categoryProducts);
          
          // Get category content
          const content = await getCategoryContentBySlug(categorySlug);
          setCategoryContent(content);
        }
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [categorySlug, subSlug]);
  
  // Get featured products (first 2 products in the category)
  const featuredProduct = products.length > 0 ? products[0] : null;
  const secondFeaturedProduct = products.length > 1 ? products[1] : null;
  
  // Default content if none is found
  const defaultContent = {
    title: category ? category.name : (categorySlug ? categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''),
    description: subcategory ? subcategory.description : (category ? category.description : "Discover the best recovery products in this category."),
    introduction: "Discover the best recovery products to improve your recovery time and enhance your performance.",
    benefits: [],
    videoId: "",
    videoTitle: "",
    videoDescription: "",
    faqs: [],
    buyingGuide: ""
  };
  
  // Use category content from service or default
  const content = categoryContent || defaultContent;

  const pageTitle = subcategory ? `${subcategory.name} ${category?.name || ''}` : content.title;
  
  // Create breadcrumb data
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: category?.name || 'Category', url: `/categories/${categorySlug}` },
  ];
  
  if (subcategory) {
    breadcrumbs.push({
      name: subcategory.name,
      url: `/categories/${categorySlug}/${subSlug}`
    });
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading category information...</p>
        </div>
      </MainLayout>
    );
  }

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
      
      {/* Category Hero */}
      <CategoryHero categorySlug={categorySlug || ''} description={content.description} />
      
      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose lg:prose-xl">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">{pageTitle}</h1>
            <div className="text-lg font-medium text-gray-800 mb-8 leading-relaxed">
              {content.introduction.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>

            {content.benefits.length > 0 && (
              <div className="bg-indigo-50 p-6 rounded-lg my-8">
                <h3 className="font-bold text-xl mb-4">Key Benefits of {pageTitle}</h3>
                <ul className="space-y-3">
                  {content.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: benefit }}></span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Featured Product */}
      {featuredProduct && <FeaturedProduct product={featuredProduct} />}
      
      {/* Second Product */}
      {secondFeaturedProduct && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Best Overall: {secondFeaturedProduct.name}
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 mb-10">
              <div className="md:w-1/2">
                <img 
                  src={secondFeaturedProduct.images[0]} 
                  alt={secondFeaturedProduct.name} 
                  className="rounded-lg shadow-md w-full object-cover"
                />
              </div>
              <div className="md:w-1/2">
                <div className="mb-3 text-amber-500">
                  <span className="text-xl font-bold">{secondFeaturedProduct.rating}/5</span>
                  <div className="flex items-center ml-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(secondFeaturedProduct.rating) 
                            ? "fill-amber-500 text-amber-500" 
                            : "text-gray-300"
                        }`} 
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">({secondFeaturedProduct.reviewCount}+ reviews)</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{secondFeaturedProduct.name}</h3>
                <p className="text-gray-800 mb-3 text-lg font-semibold">${secondFeaturedProduct.price.toFixed(2)}</p>
                <div className="mb-5">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">Premium Quality</span>
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Top Rated</span>
                </div>
                <p className="text-gray-600 mb-6">
                  {secondFeaturedProduct.description}
                </p>
                {secondFeaturedProduct.affiliateLink && (
                  <Button 
                    onClick={() => window.open(secondFeaturedProduct.affiliateLink, '_blank')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Check Price on Amazon
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* All Category Products Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            All {subcategory ? subcategory.name : category?.name} Products
          </h2>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Video Section */}
      {content.videoId && (
        <VideoSection 
          title={content.videoTitle}
          description={content.videoDescription}
          videoId={content.videoId}
        />
      )}
      
      {/* Buying Guide Section */}
      {content.buyingGuide && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Buying Guide: How to Choose the Right {pageTitle}</h2>
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              {content.buyingGuide.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-800 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Product Comparison */}
      {products.length > 1 && <ProductComparison products={products} />}
      
      {/* FAQ Section */}
      {content.faqs && content.faqs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {content.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
      
      {/* Related Products and Subcategories */}
      {category && category.subcategories && category.subcategories.length > 0 && !subcategory && (
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Explore {category.name} Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {category.subcategories.map((sub: any) => (
                <Card key={sub.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <Link to={`/categories/${category.slug}/${sub.slug}`} className="block p-6">
                      <h3 className="text-xl font-bold mb-2">{sub.name}</h3>
                      <p className="text-gray-600 mb-4">{sub.description || `Explore our ${sub.name} products`}</p>
                      <Button variant="outline" className="w-full">
                        View {sub.name}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="container mx-auto px-4 max-w-4xl text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Improve Your Recovery?</h2>
          <p className="text-xl mb-8">
            Find the perfect {subcategory ? subcategory.name : category?.name} for your recovery needs and start experiencing improved mobility, flexibility, and faster recovery.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button 
              onClick={() => window.open(`https://www.amazon.com/s?k=${categorySlug?.replace(/-/g, '+')}&tag=recoveryessentials-20`, '_blank')}
              className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg"
              variant="outline"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Shop on Amazon
            </Button>
            <Button 
              onClick={() => window.location.href = '/blog'}
              className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 px-6 rounded-lg border border-white"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              View Recovery Tips
            </Button>
          </div>
        </div>
      </section>
      
      {/* Newsletter Sign-up */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Get Recovery Tips & Exclusive Deals</h2>
          <p className="text-gray-600 mb-8">
            Subscribe to our newsletter for expert recovery advice, product recommendations, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300" 
            />
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-md">
              Subscribe Now
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default CategoryPage;
