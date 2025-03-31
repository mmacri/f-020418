
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscriptions, setSubscriptions] = useState({
    dealAlerts: true,
    productReviews: false,
    newsAndUpdates: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscriptionChange = (key: keyof typeof subscriptions) => {
    setSubscriptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      toast.success('Successfully subscribed to the newsletter!');
      
      // Reset form
      setEmail('');
      setSubscriptions({
        dealAlerts: true,
        productReviews: false,
        newsAndUpdates: false,
      });
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h1>
            <p className="text-lg opacity-90">
              Get the latest reviews, deals, and recovery tips delivered to your inbox.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Subscription Preferences</h3>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="deal-alerts"
                  checked={subscriptions.dealAlerts}
                  onCheckedChange={() => handleSubscriptionChange('dealAlerts')}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="deal-alerts"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Deal Alerts
                  </label>
                  <p className="text-sm text-gray-500">
                    Be the first to know about discounts and special offers
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="product-reviews"
                  checked={subscriptions.productReviews}
                  onCheckedChange={() => handleSubscriptionChange('productReviews')}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="product-reviews"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Product Reviews
                  </label>
                  <p className="text-sm text-gray-500">
                    Get our latest in-depth recovery product reviews
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="news-updates"
                  checked={subscriptions.newsAndUpdates}
                  onCheckedChange={() => handleSubscriptionChange('newsAndUpdates')}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="news-updates"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    News & Updates
                  </label>
                  <p className="text-sm text-gray-500">
                    Stay updated on recovery science and industry news
                  </p>
                </div>
              </div>
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Subscribe'
              )}
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              By subscribing, you agree to our privacy policy and consent to receive marketing emails.
              You can unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Newsletter;
