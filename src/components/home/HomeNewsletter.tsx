
import React from 'react';
import { Button } from '@/components/ui/button';

const HomeNewsletter: React.FC = () => {
  return (
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
  );
};

export default HomeNewsletter;
