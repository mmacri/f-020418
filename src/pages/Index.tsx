
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  ShoppingCart, 
  Star, 
  ThumbsUp, 
  CheckCircle, 
  ChevronRight 
} from 'lucide-react';
import { getNavigationCategories } from '@/services/categoryService';
import { getProducts } from '@/services/productService';
import ProductCard from '@/components/ProductCard';
import BestOfList from '@/components/BestOfList';

const Index = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get categories
        const categoriesData = await getNavigationCategories();
        setCategories(categoriesData.filter(cat => cat.showInNavigation !== false));
        
        // Get featured products
        const products = await getProducts();
        // Select a few products randomly as featured
        const featured = [...products]
          .sort(() => 0.5 - Math.random())
          .slice(0, 6);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const renderFeaturedProducts = () => (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Featured Recovery Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} featured={true} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/categories/massage-guns">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find the Best Recovery Equipment
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Expert reviews and comparisons of the top recovery tools to help you perform better, recover faster, and prevent injuries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-indigo-600 hover:bg-gray-100"
                  asChild
                >
                  <Link to="/categories/massage-guns">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Shop Recovery Gear
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/blog">
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://ext.same-assets.com/1001010126/massage-gun-category.jpg" 
                alt="Recovery Equipment" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Product Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Browse Recovery Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <Card key={category.id} className="overflow-hidden hover:shadow-xl transition-shadow border shadow-md">
                <CardContent className="p-0">
                  <Link to={`/categories/${category.slug}`} className="block">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={category.imageUrl || 'https://ext.same-assets.com/30303033/bands-category.jpg'} 
                        alt={category.name} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white text-xl font-bold">{category.name}</h3>
                      </div>
                    </div>
                    <div className="p-4 bg-card text-card-foreground">
                      <p className="text-muted-foreground text-sm mb-3">
                        {category.description || `Browse our selection of ${category.name.toLowerCase()}`}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-primary font-medium">
                          {category.subcategories?.length || 0} Subcategories
                        </span>
                        <div className="text-primary flex items-center">
                          View Products <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {renderFeaturedProducts()}
      
      {/* Why Choose Us */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-card-foreground">Why Choose Recovery Essentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-background rounded-lg">
              <div className="flex justify-center items-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                <ThumbsUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Expert Reviews</h3>
              <p className="text-muted-foreground">
                Our team thoroughly tests every product to provide honest, detailed reviews you can trust.
              </p>
            </div>
            
            <div className="text-center p-6 bg-background rounded-lg">
              <div className="flex justify-center items-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Best Products Only</h3>
              <p className="text-muted-foreground">
                We curate only the highest-quality recovery tools to help you achieve optimal results.
              </p>
            </div>
            
            <div className="text-center p-6 bg-background rounded-lg">
              <div className="flex justify-center items-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Recovery Expertise</h3>
              <p className="text-muted-foreground">
                Benefit from our deep knowledge of recovery science to find the tools that will work best for you.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 bg-indigo-600 text-primary-foreground">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Get Recovery Tips & Exclusive Deals</h2>
          <p className="text-xl opacity-90 mb-8">
            Join our newsletter to receive expert advice and special offers on the best recovery products.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-white text-foreground bg-background" 
            />
            <Button className="bg-white text-indigo-600 hover:bg-gray-100 font-medium px-6 py-3">
              Subscribe Now
            </Button>
          </div>
          <p className="text-sm opacity-80 mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">What Our Readers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md text-card-foreground">
              <div className="flex text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-500" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "The massage gun recommendation changed my recovery routine completely. I've noticed such a difference in my muscle recovery time!"
              </p>
              <div className="font-semibold">Sarah K. - Runner</div>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md text-card-foreground">
              <div className="flex text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-500" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "I was skeptical about compression gear, but after reading the detailed review, I decided to try it. Now I use it after every workout!"
              </p>
              <div className="font-semibold">Michael T. - Crossfit Athlete</div>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md text-card-foreground">
              <div className="flex text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-500" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "The product comparison helped me choose the right foam roller for my needs. The detailed breakdown of features was incredibly helpful."
              </p>
              <div className="font-semibold">Lisa M. - Yoga Instructor</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Latest Blog Posts */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-card-foreground">Latest Recovery Tips</h2>
            <Link to="/blog" className="text-primary font-medium flex items-center">
              View All Articles
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-lg overflow-hidden shadow-md bg-background">
              <Link to="/blog/foam-rolling-techniques">
                <img 
                  src="https://ext.same-assets.com/30303031/foam-roller-category.jpg" 
                  alt="Foam Rolling Techniques" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground">Essential Foam Rolling Techniques for Athletes</h3>
                  <p className="text-muted-foreground mb-4">
                    Learn the most effective foam rolling methods to release muscle tension and improve recovery time.
                  </p>
                  <div className="text-sm text-muted-foreground">May 15, 2023 • 8 min read</div>
                </div>
              </Link>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-md bg-background">
              <Link to="/blog/percussion-therapy-benefits">
                <img 
                  src="https://ext.same-assets.com/1001010126/massage-gun-category.jpg" 
                  alt="Percussion Therapy" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground">The Science Behind Percussion Therapy</h3>
                  <p className="text-muted-foreground mb-4">
                    Discover how percussion massage devices work and the scientifically-proven benefits they offer.
                  </p>
                  <div className="text-sm text-muted-foreground">April 22, 2023 • 6 min read</div>
                </div>
              </Link>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-md bg-background">
              <Link to="/blog/recovery-routine-runners">
                <img 
                  src="https://ext.same-assets.com/30303032/compression-category.jpg" 
                  alt="Recovery Routine" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground">Complete Recovery Routine for Runners</h3>
                  <p className="text-muted-foreground mb-4">
                    A step-by-step recovery protocol to help runners bounce back faster after long runs and races.
                  </p>
                  <div className="text-sm text-muted-foreground">March 10, 2023 • 10 min read</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
