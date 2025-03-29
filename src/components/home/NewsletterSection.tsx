
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
        variant: "default",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-indigo-600 text-primary-foreground">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-4">Get Recovery Tips & Exclusive Deals</h2>
        <p className="text-xl opacity-90 mb-8">
          Join our newsletter to receive expert advice and special offers on the best recovery products.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <input 
            type="email" 
            id="newsletter-email"
            name="newsletter-email"
            placeholder="Your email address" 
            className="flex-grow px-4 py-3 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-white text-foreground bg-background" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address for newsletter"
          />
          <Button 
            type="submit"
            className="bg-white text-indigo-600 hover:bg-gray-100 font-medium px-6 py-3"
            disabled={isSubmitting}
            aria-label="Subscribe to newsletter"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
          </Button>
        </form>
        <p className="text-sm opacity-80 mt-4">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;
