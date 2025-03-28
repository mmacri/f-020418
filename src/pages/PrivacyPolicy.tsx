
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <p className="text-gray-600 mb-4">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-3">Information We Collect</h2>
            <p>
              At Recovery Essentials, we take your privacy seriously. This Privacy Policy describes how we collect, use, and protect your personal information when you visit our website or use our services.
            </p>
            
            <h3 className="text-lg font-medium mt-5 mb-2">Personal Information</h3>
            <p>
              We may collect personal information such as your name, email address, and contact details when you subscribe to our newsletter, make a purchase, or contact us.
            </p>
            
            <h3 className="text-lg font-medium mt-5 mb-2">Usage Data</h3>
            <p>
              We collect information about how you interact with our website, including pages visited, time spent on pages, and other browsing data. This helps us improve your experience and optimize our content.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-5 mt-2 mb-4">
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Send you emails, including newsletters, updates, and marketing communications</li>
              <li>Process transactions and send related information</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Affiliate Disclosure</h2>
            <p>
              Our website contains affiliate links, which means we may earn a commission if you click on a link and make a purchase. This does not affect your purchase price. As an Amazon Associate, we earn from qualifying purchases.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@recoveryessentials.com.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
