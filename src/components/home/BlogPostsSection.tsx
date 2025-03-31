import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getPublishedBlogPosts, BlogPost } from '@/services/blog';

const BlogPostsSection: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    getPublishedBlogPosts().then((posts) => {
      setBlogPosts(posts);
    });
  }, []);

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
          {blogPosts.map((post) => (
            <div className="rounded-lg overflow-hidden shadow-md bg-background" key={post.id}>
              <Link to={`/blog/${post.slug}`}>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground">{post.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {post.description}
                  </p>
                  <div className="text-sm text-muted-foreground">{post.date} • {post.readTime} min read</div>
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
