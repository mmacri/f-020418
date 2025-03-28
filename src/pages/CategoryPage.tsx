
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryHero from '@/components/CategoryHero';
import FeaturedProduct from '@/components/FeaturedProduct';
import ProductComparison from '@/components/ProductComparison';
import VideoSection from '@/components/VideoSection';
import { getProductsByCategory } from '@/lib/product-utils';
import { Button } from '@/components/ui/button';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const products = categorySlug ? getProductsByCategory(categorySlug) : [];
  
  // Get featured product (first product in the category)
  const featuredProduct = products.length > 0 ? products[0] : null;
  
  // Category-specific content
  const categoryContent = {
    'fitness-bands': {
      description: "Comprehensive guide to the top resistance and fitness bands for improving flexibility, mobility, and aiding recovery",
      introduction: "Resistance bands are one of the most versatile recovery tools available, providing gentle resistance for stretching, rehabilitation, and mobility work. They're portable, affordable, and suitable for users of all fitness levels. Our team has tested dozens of bands to find the best options for recovery, mobility, and injury prevention.",
      benefits: [
        "Enhanced Flexibility: Provides gentle assistance for deeper, more effective stretches",
        "Improved Circulation: Promotes blood flow to muscles for faster recovery",
        "Joint Mobility: Helps restore range of motion after workouts or injury",
        "Muscle Activation: Engages stabilizer muscles that are often overlooked",
        "Progressive Resistance: Allows for gradual increase in intensity as recovery progresses"
      ],
      videoId: "PjZ9w2cQP-Q",
      videoTitle: "Resistance Band Recovery Techniques",
      videoDescription: "Watch this video to learn effective resistance band stretches and mobility exercises that can enhance your recovery and improve flexibility:"
    },
    'massage-guns': {
      description: "Expert reviews and comparisons of the best percussion massage guns for faster recovery and pain relief",
      introduction: "Percussion massage guns have revolutionized muscle recovery with their ability to deliver powerful, targeted deep tissue massage. These handheld devices use rapid pulses to penetrate muscle tissue, increase blood flow, and release tension. Our experts have thoroughly tested the top massage guns to help you find the perfect option for your recovery needs.",
      benefits: [
        "Accelerated Recovery: Reduces post-workout soreness and recovery time",
        "Improved Blood Flow: Enhances circulation to damaged tissues",
        "Decreased Pain: Helps alleviate muscle pain and stiffness",
        "Increased Range of Motion: Reduces muscle tension that limits movement",
        "Stress Reduction: Promotes relaxation and reduces cortisol levels"
      ],
      videoId: "hKYEn-6Dt_M",
      videoTitle: "How to Use a Massage Gun Effectively",
      videoDescription: "Learn the proper techniques for using a percussion massage gun to maximize recovery benefits while avoiding common mistakes:"
    },
    // Add other categories as needed
  };
  
  const content = categorySlug && categoryContent[categorySlug] 
    ? categoryContent[categorySlug] 
    : {
        description: "",
        introduction: "Discover the best recovery products in this category.",
        benefits: [],
        videoId: "",
        videoTitle: "",
        videoDescription: ""
      };

  return (
    <>
      <Header />
      
      {/* Category Hero */}
      <CategoryHero categorySlug={categorySlug || ''} description={content.description} />
      
      {/* Introduction */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose lg:prose-xl">
            <p className="text-lg font-medium text-gray-800 mb-6">
              {content.introduction}
            </p>

            {content.benefits.length > 0 && (
              <div className="bg-indigo-50 p-6 rounded-lg my-8">
                <h3 className="font-bold text-xl mb-3">Benefits of {categorySlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} for Recovery</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  {content.benefits.map((benefit, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: benefit }}></li>
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
      {products.length > 1 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Best Overall: {products[1].name}
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 mb-10">
              <div className="md:w-1/2">
                <img 
                  src={products[1].images[0].url} 
                  alt={products[1].name} 
                  className="rounded-lg shadow-md w-full"
                />
              </div>
              <div className="md:w-1/2">
                <div className="mb-3 text-amber-500">
                  <span className="text-xl font-bold">{products[1].rating}/5</span>
                  <span className="ml-2">
                    {'★'.repeat(Math.floor(products[1].rating))}
                    {products[1].rating % 1 >= 0.5 ? '½' : ''}
                    {'☆'.repeat(5 - Math.ceil(products[1].rating))}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">({products[1].reviewCount}+ reviews)</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{products[1].name}</h3>
                <p className="text-gray-800 mb-3 text-lg font-semibold">${products[1].price.toFixed(2)}</p>
                <div className="mb-5">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">Durable Construction</span>
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Set of 4 Intensities</span>
                </div>
                <p className="text-gray-600 mb-6">
                  {products[1].description}
                </p>
                {products[1].asin && (
                  <Button 
                    onClick={() => window.open(`https://www.amazon.com/dp/${products[1].asin}?tag=recoveryessentials-20`, '_blank')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg"
                  >
                    Check Price on Amazon
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Video Section */}
      {content.videoId && (
        <VideoSection 
          title={content.videoTitle}
          description={content.videoDescription}
          videoId={content.videoId}
        />
      )}
      
      {/* Product Comparison */}
      {products.length > 0 && <ProductComparison products={products} />}
      
      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="container mx-auto px-4 max-w-4xl text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Improve Your Recovery?</h2>
          <p className="text-xl mb-8">
            Find the perfect {categorySlug?.replace(/-/g, ' ')} for your recovery needs and start experiencing improved mobility, flexibility, and faster recovery.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button 
              onClick={() => window.open(`https://www.amazon.com/s?k=${categorySlug?.replace(/-/g, '+')}&tag=recoveryessentials-20`, '_blank')}
              className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg"
              variant="outline"
            >
              Shop on Amazon
            </Button>
            <Button 
              onClick={() => window.location.href = '/blog'}
              className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 px-6 rounded-lg border border-white"
            >
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
      
      <Footer />
    </>
  );
};

export default CategoryPage;
