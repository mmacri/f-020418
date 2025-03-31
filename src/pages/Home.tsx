
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { getNavigationCategories } from '@/services/categoryService';
import { getProducts } from '@/services/productService';
import { 
  ChevronRight, 
  ArrowRight, 
  ShoppingCart, 
  CheckCircle 
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { localStorageKeys } from '@/lib/constants';

const DEFAULT_HERO_IMAGE = "https://ext.same-assets.com/1001010126/massage-gun-category.jpg";
const LOCAL_FALLBACK_IMAGE = "/placeholder.svg";

const Home = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState<string>("");
  
  useEffect(() => {
    // Load hero image from localStorage
    const savedHeroImage = localStorage.getItem(localStorageKeys.HERO_IMAGE) || DEFAULT_HERO_IMAGE;
    setHeroImage(savedHeroImage);
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get categories
        const categoriesData = await getNavigationCategories();
        setCategories(categoriesData);
        
        // Get products
        const products = await getProducts();
        
        // Featured products (products with highest rating)
        const featured = [...products]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
        setFeaturedProducts(featured);
        
        // Best sellers (could be based on other criteria, here using most reviews)
        const bestselling = [...products]
          .sort((a, b) => b.reviewCount - a.reviewCount)
          .slice(0, 6);
        setBestSellers(bestselling);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleHeroImageError = () => {
    // Check if we should use local fallback
    const useLocalFallback = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
    const fallbackImage = useLocalFallback ? LOCAL_FALLBACK_IMAGE : DEFAULT_HERO_IMAGE;
    setHeroImage(fallbackImage);
    console.log("Hero image failed to load. Using fallback image.");
  };
  
  const renderFeaturedProducts = () => (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Featured Products</h2>
        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Discover our hand-picked selection of the highest-rated recovery tools that deliver exceptional results.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} featured={true} />
          ))}
        </div>
      </div>
    </section>
  );
  
  const renderBestSellers = () => (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Best Sellers</h2>
          <Link to="/products" className="text-indigo-600 font-medium flex items-center">
            View All Products
            <ChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-cover bg-center py-28" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('${heroImage}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Recover Faster, Perform Better
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Find the best recovery equipment with our expert reviews and comparisons
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              asChild
            >
              <Link to="/products">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Shop All Products
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white/20"
              asChild
            >
              <Link to="/blog">
                Recovery Tips
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        {/* Hidden image for preloading and error handling */}
        <img 
          src={heroImage} 
          alt="" 
          className="hidden" 
          onError={handleHeroImageError}
        />
      </section>
      
      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Top Recovery Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.slice(0, 4).map(category => (
              <Link 
                key={category.id} 
                to={`/categories/${category.slug}`}
                className="group block overflow-hidden rounded-lg shadow-md transition-all hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.imageUrl || `https://ext.same-assets.com/30303031/foam-roller-category.jpg`} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const useLocalFallback = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
                      target.src = useLocalFallback ? LOCAL_FALLBACK_IMAGE : `https://ext.same-assets.com/30303031/foam-roller-category.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white text-xl font-bold">{category.name}</h3>
                      <div className="flex items-center text-white/80 mt-1 text-sm">
                        View Collection
                        <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" asChild>
              <Link to="/categories">
                View All Categories
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {renderFeaturedProducts()}
      
      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-indigo-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-12">Why Recovery Essentials?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Honest Reviews</h3>
                <p className="text-gray-600">
                  We thoroughly test every product to provide unbiased, detailed reviews you can trust.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Expert Guidance</h3>
                <p className="text-gray-600">
                  Our team of fitness professionals provides expert advice to help you select the right tools.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Value for Money</h3>
                <p className="text-gray-600">
                  We compare prices and features to ensure you get the best value for your investment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {renderBestSellers()}
      
      {/* Newsletter */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-xl opacity-90 mb-8">
            Get exclusive deals, recovery tips, and product recommendations delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-indigo-600 hover:bg-gray-100 font-medium px-6 py-3">
              Subscribe
            </Button>
          </div>
          <p className="text-sm opacity-80 mt-4">
            We respect your privacy and will never share your information.
          </p>
        </div>
      </section>
      
      {/* Recent Articles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Recovery Tips & Advice</h2>
            <Link to="/blog" className="text-indigo-600 font-medium flex items-center">
              View All Articles
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://ext.same-assets.com/30303031/foam-roller-category.jpg" 
                alt="Foam Rolling" 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const useLocalFallback = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
                  target.src = useLocalFallback ? LOCAL_FALLBACK_IMAGE : DEFAULT_HERO_IMAGE;
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">5 Foam Rolling Techniques for Lower Back Pain</h3>
                <p className="text-gray-600 mb-4">
                  Learn how to effectively use a foam roller to relieve lower back tension and pain.
                </p>
                <Link to="/blog/foam-rolling-techniques" className="text-indigo-600 font-medium flex items-center">
                  Read More
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://ext.same-assets.com/1001010126/massage-gun-category.jpg" 
                alt="Massage Gun" 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const useLocalFallback = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
                  target.src = useLocalFallback ? LOCAL_FALLBACK_IMAGE : DEFAULT_HERO_IMAGE;
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Massage Gun vs. Foam Roller: Which Is Better?</h3>
                <p className="text-gray-600 mb-4">
                  Compare the benefits and differences between these popular recovery tools.
                </p>
                <Link to="/blog/massage-gun-vs-foam-roller" className="text-indigo-600 font-medium flex items-center">
                  Read More
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://ext.same-assets.com/30303032/compression-category.jpg" 
                alt="Compression Recovery" 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const useLocalFallback = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
                  target.src = useLocalFallback ? LOCAL_FALLBACK_IMAGE : DEFAULT_HERO_IMAGE;
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">The Science of Compression for Recovery</h3>
                <p className="text-gray-600 mb-4">
                  Understand how compression gear works and its proven benefits for athletes.
                </p>
                <Link to="/blog/compression-recovery-science" className="text-indigo-600 font-medium flex items-center">
                  Read More
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
