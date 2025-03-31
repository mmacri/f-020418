import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getPublishedBlogPosts, BlogPost } from '@/services/blog';
import { localStorageKeys } from '@/lib/constants';

const DEFAULT_HERO_IMAGE = "https://ext.same-assets.com/1001010126/massage-gun-category.jpg";
const LOCAL_FALLBACK_IMAGE = "/placeholder.svg";

const HomeRecentArticles: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setIsLoading(true);
      try {
        const posts = await getPublishedBlogPosts();
        setBlogPosts(posts.slice(0, 3)); // Get only the first 3 posts
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
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
          {isLoading ? (
            // Display a loading state
            [1, 2, 3].map((index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 mb-2"></div>
                  <div className="h-4 bg-gray-200 mb-4"></div>
                  <div className="h-4 bg-gray-200"></div>
                </div>
              </div>
            ))
          ) : blogPosts.length > 0 ? (
            // Display blog posts if available
            blogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                <img 
                  src={post.image || DEFAULT_HERO_IMAGE} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const useLocalFallback = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
                    target.src = useLocalFallback ? LOCAL_FALLBACK_IMAGE : DEFAULT_HERO_IMAGE;
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="text-indigo-600 font-medium flex items-center">
                    Read More
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            // Display a message if no blog posts are available
            <div className="text-center col-span-3">
              <p className="text-gray-500">No recent articles found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeRecentArticles;
