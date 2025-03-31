
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getPublishedBlogPosts, BlogPost } from '@/services/blog';

const BlogPostsSection: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setIsLoading(true);
      try {
        const posts = await getPublishedBlogPosts();
        // Get the 3 most recent posts
        const recentPosts = [...posts].sort((a, b) => {
          const dateA = a.created_at || a.createdAt;
          const dateB = b.created_at || b.createdAt;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        }).slice(0, 3);
        
        setBlogPosts(recentPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (isLoading || blogPosts.length === 0) {
    return null; // Don't show the section if there are no posts or still loading
  }

  return (
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
          {blogPosts.map(post => (
            <div key={post.id} className="rounded-lg overflow-hidden shadow-md bg-background">
              <Link to={`/blog/${post.slug}`}>
                <img 
                  src={post.image || post.image_url || post.coverImage || "https://placehold.co/600x400?text=No+Image"}
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground">{post.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {post.excerpt && post.excerpt.length > 120 
                      ? post.excerpt.substring(0, 120) + '...' 
                      : post.excerpt}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    {post.date} • {post.readTime || post.read_time || `${Math.ceil(post.content.length / 1000)} min read`}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPostsSection;
