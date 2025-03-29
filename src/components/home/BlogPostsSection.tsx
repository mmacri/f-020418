
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const BlogPostsSection: React.FC = () => {
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
  );
};

export default BlogPostsSection;
