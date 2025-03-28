
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPostCard from "@/components/BlogPostCard";
import { useState } from "react";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const blogPosts = [
    {
      id: 1,
      slug: "recovery-frequency",
      title: "How Often Should You Use Recovery Tools?",
      excerpt: "Finding the optimal frequency for massage guns, foam rollers, and other recovery modalities for your specific needs.",
      image: "https://ext.same-assets.com/4181642789/575270868.jpeg",
      category: "Recovery Science",
      date: "April 12, 2023",
      readTime: "5 min read",
      author: "Elena Rodriguez"
    },
    {
      id: 2,
      slug: "massage-gun-techniques",
      title: "6 Effective Massage Gun Techniques for Faster Recovery",
      excerpt: "Master these techniques to maximize your percussion therapy results and enhance muscle recovery.",
      image: "https://ext.same-assets.com/198595764/1658350751.jpeg",
      category: "Techniques",
      date: "May 14, 2023",
      readTime: "8 min read",
      author: "Dr. Sarah Johnson"
    },
    {
      id: 3,
      slug: "active-vs-passive-recovery",
      title: "Essential Recovery Routines for Runners",
      excerpt: "Follow these research-backed recovery routines to enhance performance and prevent common running injuries.",
      image: "https://ext.same-assets.com/30303036/runner-recovery-routine.jpg",
      category: "Running Recovery",
      date: "June 21, 2023",
      readTime: "10 min read"
    },
    {
      id: 4,
      slug: "foam-rolling-guide",
      title: "The Ultimate Guide to Foam Rolling",
      excerpt: "Learn proper foam rolling techniques to relieve muscle tension and improve flexibility.",
      image: "https://ext.same-assets.com/1001010124/foam-roller-guide.jpg",
      category: "Techniques",
      date: "July 8, 2023",
      readTime: "12 min read",
      author: "Dr. Sarah Johnson"
    }
  ];

  // Filter posts based on category and search term
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === "all" || post.category.toLowerCase().replace(/\s+/g, '-') === activeCategory;
    const matchesSearch = searchTerm === "" || 
                         post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Recovery Essentials Blog</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Expert advice, tips, and science-backed information to help you optimize your recovery and performance.
          </p>
          
          {/* Search Bar */}
          <div className="mt-6 max-w-lg mx-auto relative">
            <input 
              type="text" 
              className="w-full pl-12 pr-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300" 
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-4 -mx-4 px-4 whitespace-nowrap">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 mx-2 rounded-md font-medium ${
                activeCategory === "all" ? "bg-indigo-600 text-white" : "text-gray-700 hover:text-indigo-600"
              }`}
            >
              All Categories
            </button>
            <button
              onClick={() => setActiveCategory("recovery-science")}
              className={`px-4 py-2 mx-2 rounded-md font-medium ${
                activeCategory === "recovery-science" ? "bg-indigo-600 text-white" : "text-gray-700 hover:text-indigo-600"
              }`}
            >
              Recovery Science
            </button>
            <button
              onClick={() => setActiveCategory("techniques")}
              className={`px-4 py-2 mx-2 rounded-md font-medium ${
                activeCategory === "techniques" ? "bg-indigo-600 text-white" : "text-gray-700 hover:text-indigo-600"
              }`}
            >
              Techniques
            </button>
            <button
              onClick={() => setActiveCategory("running-recovery")}
              className={`px-4 py-2 mx-2 rounded-md font-medium ${
                activeCategory === "running-recovery" ? "bg-indigo-600 text-white" : "text-gray-700 hover:text-indigo-600"
              }`}
            >
              Running Recovery
            </button>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Featured Article</h2>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <Link to="/blog/foam-rolling-guide" className="block overflow-hidden rounded-lg shadow-lg h-full">
                <img 
                  src="https://ext.same-assets.com/1001010124/foam-roller-guide.jpg" 
                  alt="The Ultimate Guide to Foam Rolling for Recovery" 
                  className="w-full h-80 object-cover"
                />
              </Link>
            </div>
            <div className="lg:col-span-2 flex flex-col">
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Techniques</span>
                <span className="text-gray-500 text-sm ml-2">July 8, 2023</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                <Link to="/blog/foam-rolling-guide" className="text-gray-900 hover:text-indigo-600">
                  The Ultimate Guide to Foam Rolling for Recovery
                </Link>
              </h3>
              <p className="text-gray-600 mb-6">
                Learn how to effectively use foam rollers to enhance muscle recovery, improve mobility, and prevent injuries.
              </p>
              <Link to="/blog/foam-rolling-guide" className="text-indigo-600 hover:text-indigo-800 font-medium mt-auto inline-flex items-center">
                Read More
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Latest Articles</h2>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Sort by:</span>
              <select className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600 mb-4">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or category filters</p>
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter callout */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Get the latest recovery tips, product reviews, and exclusive offers delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
              Subscribe
            </button>
          </div>
          <p className="mt-4 text-sm text-indigo-200">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
