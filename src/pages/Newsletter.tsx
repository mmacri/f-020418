
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInterestChange = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Subscription Successful!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
      setName("");
      setInterests([]);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Join Our Newsletter</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Get exclusive recovery tips, product recommendations, and special offers delivered straight to your inbox.
          </p>
        </div>
      </section>

      {/* Newsletter Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Subscribe to Our Newsletter</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topics You're Interested In</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="massage-guns"
                        checked={interests.includes("massage-guns")}
                        onChange={() => handleInterestChange("massage-guns")}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="massage-guns" className="ml-2 text-gray-700">Massage Guns</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="foam-rollers"
                        checked={interests.includes("foam-rollers")}
                        onChange={() => handleInterestChange("foam-rollers")}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="foam-rollers" className="ml-2 text-gray-700">Foam Rollers</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="fitness-bands"
                        checked={interests.includes("fitness-bands")}
                        onChange={() => handleInterestChange("fitness-bands")}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="fitness-bands" className="ml-2 text-gray-700">Fitness Bands</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="compression-gear"
                        checked={interests.includes("compression-gear")}
                        onChange={() => handleInterestChange("compression-gear")}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="compression-gear" className="ml-2 text-gray-700">Compression Gear</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="recovery-tips"
                        checked={interests.includes("recovery-tips")}
                        onChange={() => handleInterestChange("recovery-tips")}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="recovery-tips" className="ml-2 text-gray-700">Recovery Tips & Techniques</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">
                    By subscribing, you agree to receive marketing emails from Recovery Essentials. 
                    You can unsubscribe at any time by clicking the unsubscribe link in any email. 
                    For more information, see our <a href="/privacy" className="text-indigo-600 hover:text-indigo-800">Privacy Policy</a>.
                  </p>
                </div>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 w-full"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe Now"}
                </Button>
              </form>
            </div>
            
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4">What You'll Receive</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="flex-shrink-0 text-indigo-600 mr-3">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Weekly Recovery Tips</h4>
                    <p className="text-gray-600">Science-backed techniques to enhance your recovery routine.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 text-indigo-600 mr-3">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Product Recommendations</h4>
                    <p className="text-gray-600">Personalized suggestions based on your interests.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 text-indigo-600 mr-3">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Exclusive Deals</h4>
                    <p className="text-gray-600">Special discounts and offers from our partner brands.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 text-indigo-600 mr-3">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">New Content Alerts</h4>
                    <p className="text-gray-600">Be the first to know when we publish new guides and reviews.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Newsletter;
