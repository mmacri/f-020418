
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Check, Search, BarChart2, ThumbsUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 md:py-24 bg-blend-overlay bg-cover bg-center" style={{backgroundImage: "url('https://ext.same-assets.com/30303011/recovery-hero-bg.jpg')"}}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover the Best Home Fitness Recovery Products</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Find the perfect tools to accelerate recovery, reduce soreness, and enhance your performance with our expert reviews and guides.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#product-categories" className="bg-white text-indigo-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition duration-300">
              Explore Top Picks
            </a>
          </div>
          <p className="text-xs text-white text-opacity-80 mt-16 max-w-2xl mx-auto">
            Affiliate Disclosure: We may earn commissions from qualifying purchases at no cost to you.
          </p>
        </div>
      </section>

      {/* Product Categories Section */}
      <section id="product-categories" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recovery Product Categories</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our top-rated fitness recovery tools to help you recover faster, reduce soreness, and improve your performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category 1: Massage Guns */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
              <div className="h-64 bg-gray-200 relative">
                <img src="https://ext.same-assets.com/30303030/massage-gun-category.jpg" alt="Person using a massage gun" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold">Massage Guns</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Percussive therapy devices that target muscle soreness and accelerate recovery through deep tissue massage.</p>
                <Link to="/categories/massage-guns" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                  See our top picks <span className="ml-2">→</span>
                </Link>
              </div>
            </div>

            {/* Category 2: Foam Rollers */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
              <div className="h-64 bg-gray-200 relative">
                <img src="https://ext.same-assets.com/30303031/foam-roller-category.jpg" alt="Person using a foam roller" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold">Foam Rollers</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Self-myofascial release tools that help break up knots, increase blood flow, and improve mobility and flexibility.</p>
                <Link to="/categories/foam-rollers" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                  Compare top models <span className="ml-2">→</span>
                </Link>
              </div>
            </div>

            {/* Category 3: Fitness Bands */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
              <div className="h-64 bg-gray-200 relative">
                <img src="https://ext.same-assets.com/30303032/fitness-bands-category.jpg" alt="Person using fitness bands" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold">Fitness Bands</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Versatile resistance tools perfect for mobility work, strength training, and rehabilitation exercises.</p>
                <Link to="/categories/fitness-bands" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                  View all reviewed bands <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're committed to providing you with the most reliable, data-driven recommendations for fitness recovery products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Process Step 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex justify-center mb-6">
                <span className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                  <Search size={24} />
                </span>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Research & Review</h3>
              <p className="text-gray-600 text-center">
                We gather data from thousands of customer reviews, expert opinions, and performance tests to identify top products in each category.
              </p>
            </div>

            {/* Process Step 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex justify-center mb-6">
                <span className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                  <BarChart2 size={24} />
                </span>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Analysis & Comparison</h3>
              <p className="text-gray-600 text-center">
                Our advanced algorithms compare quality, performance, durability, and value to generate objective product rankings tailored to different needs.
              </p>
            </div>

            {/* Process Step 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex justify-center mb-6">
                <span className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                  <ThumbsUp size={24} />
                </span>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Recommendations</h3>
              <p className="text-gray-600 text-center">
                We provide unbiased, evidence-based recommendations that help you find the perfect recovery products for your specific needs and budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Us</h2>
              <p className="text-lg text-gray-600 mb-6">
                Recovery Essentials was founded by a team of fitness enthusiasts, physical therapists, and product testers who were frustrated with the lack of honest, thorough recovery product reviews.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We've tested hundreds of products and spent thousands of hours researching the science of recovery to help you make informed decisions about which tools will actually help you recover faster and perform better.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our mission is to cut through the marketing hype and deliver honest, science-backed recommendations for recovery tools that actually work.
              </p>
              <Link to="/about" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800">
                Learn more about our team <span className="ml-2">→</span>
              </Link>
            </div>
            <div className="md:w-1/2">
              <img src="https://ext.same-assets.com/30303033/team-testing-recovery-tools.jpg" alt="Our team testing recovery tools" className="rounded-lg shadow-xl w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Affiliate Disclosure Section */}
      <section className="py-20 bg-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Trust Us?</h2>

          <div className="flex flex-col md:flex-row gap-10">
            {/* Our Commitment */}
            <div className="md:w-1/2">
              <ul className="space-y-6">
                <li className="flex">
                  <span className="flex-shrink-0 text-green-500 mr-3">
                    <Check className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Thorough Testing</h3>
                    <p className="text-gray-600">We personally test and evaluate many of the products we recommend to ensure they meet our high standards.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="flex-shrink-0 text-green-500 mr-3">
                    <Check className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Data-Driven Approach</h3>
                    <p className="text-gray-600">Our recommendations are based on analysis of verified user experiences, expert opinions, and robust performance data.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="flex-shrink-0 text-green-500 mr-3">
                    <Check className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Regular Updates</h3>
                    <p className="text-gray-600">We continuously update our reviews and recommendations to reflect new products, technologies, and user feedback.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="flex-shrink-0 text-green-500 mr-3">
                    <Check className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Expert Contributors</h3>
                    <p className="text-gray-600">Our content is created by fitness professionals, physical therapists, and recovery specialists.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Affiliate Disclosure */}
            <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-md">
              <h3 className="font-bold text-xl text-gray-900 mb-4">Affiliate Disclosure</h3>
              <p className="text-gray-600 mb-4">
                Recovery Essentials is reader-supported. When you purchase through links on our site, we may earn an affiliate commission at no additional cost to you. This helps us maintain our rigorous testing and editorial standards.
              </p>
              <p className="text-gray-600 mb-4">
                Our product recommendations are based solely on our evaluation process, not on which companies offer affiliate programs. We never accept free products or payment for positive reviews.
              </p>
              <p className="text-gray-600">
                Our mission is to help you find the best products for your needs, not to sell you on specific brands or models.
              </p>
              <div className="mt-6">
                <Link to="/affiliate-disclosure" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Read our full affiliate disclosure →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Latest Recovery Tips</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Article 1 */}
            <article className="bg-white rounded-lg overflow-hidden shadow-md transition transform hover:shadow-xl">
              <div className="h-48 bg-gray-200 relative">
                <img src="https://ext.same-assets.com/30303034/muscle-recovery-science.jpg" alt="Science of Muscle Recovery" className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs py-1 px-2 rounded-md">
                  Recovery Science
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">
                  <Link to="/blog/recovery-frequency" className="text-gray-900 hover:text-indigo-600">
                    The Science Behind Muscle Recovery
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">
                  Understand the physiological processes behind muscle recovery and how to optimize them for better results.
                </p>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>April 15, 2023</span>
                  <span>8 min read</span>
                </div>
              </div>
            </article>

            {/* Article 2 */}
            <article className="bg-white rounded-lg overflow-hidden shadow-md transition transform hover:shadow-xl">
              <div className="h-48 bg-gray-200 relative">
                <img src="https://ext.same-assets.com/30303035/choosing-massage-gun.jpg" alt="Person choosing massage gun" className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs py-1 px-2 rounded-md">
                  Buying Guide
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">
                  <Link to="/blog/massage-gun-techniques" className="text-gray-900 hover:text-indigo-600">
                    How to Choose the Right Massage Gun
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover the key features to consider when selecting a massage gun for your specific recovery needs.
                </p>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>May 3, 2023</span>
                  <span>6 min read</span>
                </div>
              </div>
            </article>

            {/* Article 3 */}
            <article className="bg-white rounded-lg overflow-hidden shadow-md transition transform hover:shadow-xl">
              <div className="h-48 bg-gray-200 relative">
                <img src="https://ext.same-assets.com/30303036/runner-recovery-routine.jpg" alt="Runner stretching" className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs py-1 px-2 rounded-md">
                  Running Recovery
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">
                  <Link to="/blog/active-vs-passive-recovery" className="text-gray-900 hover:text-indigo-600">
                    Essential Recovery Routines for Runners
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">
                  Follow these research-backed recovery routines to enhance performance and prevent common running injuries.
                </p>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>June 21, 2023</span>
                  <span>10 min read</span>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-12 text-center">
            <Link to="/blog" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-md transition duration-300">
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get Recovery Tips & Exclusive Deals</h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest recovery tips, product recommendations, and exclusive deals straight to your inbox.
          </p>

          <form className="max-w-md mx-auto" action="/newsletter" method="get">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                required
              />
              <Button 
                type="submit"
                className="bg-indigo-800 hover:bg-indigo-900 text-white font-medium py-3 px-6 rounded-md transition duration-300"
              >
                Subscribe Now
              </Button>
            </div>
            <p className="text-xs text-indigo-200 mt-4">
              By subscribing, you agree to our privacy policy. We'll never share your information.
            </p>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
