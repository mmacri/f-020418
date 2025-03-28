
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="prose max-w-none text-gray-700">
            <p className="mb-4">
              Last Updated: June 1, 2023
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Introduction</h2>
            <p className="mb-4">
              Recovery Essentials ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, 
              including any other media form, media channel, mobile website, or mobile application related or connected thereto 
              (collectively, the "Site").
            </p>
            <p className="mb-4">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Site.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h2>
            <p className="mb-4">
              We collect information about you in various ways when you use our Site.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Personal Data</h3>
            <p className="mb-4">
              Personally identifiable information, such as your name, email address, and demographic information, 
              that you voluntarily give to us when you register with the Site or when you choose to participate in various 
              activities related to the Site, such as online chat, subscribing to our newsletter, and other similar activities.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Derivative Data</h3>
            <p className="mb-4">
              Information our servers automatically collect when you access the Site, such as your IP address, browser type, 
              operating system, access times, and the pages you have viewed directly before and after accessing the Site.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Financial Data</h3>
            <p className="mb-4">
              Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, 
              expiration date) that we may collect when you purchase, order, return, exchange, or request information about our 
              services from the Site. We store only very limited, if any, financial information that we collect.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Use of Your Information</h2>
            <p className="mb-4">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. 
              Specifically, we may use information collected about you via the Site to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Create and manage your account.</li>
              <li className="mb-2">Deliver targeted advertising, newsletters, and other information regarding promotions and the Site to you.</li>
              <li className="mb-2">Email you regarding your account or order.</li>
              <li className="mb-2">Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
              <li className="mb-2">Generate a personal profile about you to make future visits to the Site more personalized.</li>
              <li className="mb-2">Increase the efficiency and operation of the Site.</li>
              <li className="mb-2">Monitor and analyze usage and trends to improve your experience with the Site.</li>
              <li className="mb-2">Notify you of updates to the Site.</li>
              <li className="mb-2">Offer new products, services, mobile applications, and/or recommendations to you.</li>
              <li className="mb-2">Perform other business activities as needed.</li>
              <li className="mb-2">Request feedback and contact you about your use of the Site.</li>
              <li className="mb-2">Resolve disputes and troubleshoot problems.</li>
              <li className="mb-2">Respond to product and customer service requests.</li>
              <li className="mb-2">Send you a newsletter.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Disclosure of Your Information</h2>
            <p className="mb-4">
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">By Law or to Protect Rights</h3>
            <p className="mb-4">
              If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy 
              potential violations of our policies, or to protect the rights, property, and safety of others, we may share your 
              information as permitted or required by any applicable law, rule, or regulation.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Third-Party Service Providers</h3>
            <p className="mb-4">
              We may share your information with third parties that perform services for us or on our behalf, including payment 
              processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Marketing Communications</h3>
            <p className="mb-4">
              With your consent, or with an opportunity for you to withdraw consent, we may share your information with third 
              parties for marketing purposes, as permitted by law.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <p className="mb-4">
              Recovery Essentials<br />
              Email: privacy@recoveryessentials.com<br />
              Address: 123 Recovery Lane, Fitness City, FC 12345
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
