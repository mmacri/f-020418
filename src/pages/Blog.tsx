
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPostCard from "@/components/BlogPostCard";
import { getPublishedBlogPosts, BlogPost } from "@/services/blog";
import { Loader2 } from "lucide-react";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setIsLoading(true);
      try {
        const posts = await getPublishedBlogPosts();
        setBlogPosts(posts);
        
        if (posts.length > 0) {
          // Set the first post as featured or find one marked as featured
          const featured = posts.find(post => post.attributes?.featured) || posts[0];
          setFeaturedPost(featured);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Extract unique categories from all posts
  const categories = [...new Set(blogPosts.map(post => post.category))];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === "all" || 
                          post.category.toLowerCase().replace(/\s+/g, '-') === activeCategory;
    const matchesSearch = searchTerm === "" || 
                         post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Recovery Essentials Blog</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Expert advice, tips, and science-backed information to help you optimize your recovery and performance.
          </p>
          
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
            
            {/* Generate category buttons dynamically from available categories */}
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category.toLowerCase().replace(/\s+/g, '-'))}
                className={`px-4 py-2 mx-2 rounded-md font-medium ${
                  activeCategory === category.toLowerCase().replace(/\s+/g, '-') 
                    ? "bg-indigo-600 text-white" 
                    : "text-gray-700 hover:text-indigo-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {featuredPost && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Featured Article</h2>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <Link to={`/blog/${featuredPost.slug}`} className="block overflow-hidden rounded-lg shadow-lg h-full">
                  <img 
                    src={featuredPost.image || featuredPost.coverImage || "https://placehold.co/600x400?text=No+Image"} 
                    alt={featuredPost.title} 
                    className="w-full h-80 object-cover"
                  />
                </Link>
              </div>
              <div className="lg:col-span-2 flex flex-col">
                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {featuredPost.category}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">{featuredPost.date}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  <Link to={`/blog/${featuredPost.slug}`} className="text-gray-900 hover:text-indigo-600">
                    {featuredPost.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-6">
                  {featuredPost.excerpt}
                </p>
                <Link to={`/blog/${featuredPost.slug}`} className="text-indigo-600 hover:text-indigo-800 font-medium mt-auto inline-flex items-center">
                  Read More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

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

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogPostCard 
                  key={post.id} 
                  post={post} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600 mb-4">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or category filters, or add articles via the admin dashboard</p>
            </div>
          )}
        </div>
      </section>

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
