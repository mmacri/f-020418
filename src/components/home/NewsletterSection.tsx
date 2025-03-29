
import React from 'react';
import { Button } from '@/components/ui/button';

const NewsletterSection: React.FC = () => {
  return (
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
  );
};

export default NewsletterSection;
