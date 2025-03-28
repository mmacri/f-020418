
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We value your privacy and are committed to protecting your personal information.
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose lg:prose-xl">
            <h2>Introduction</h2>
            <p>
              This Privacy Policy explains how Recovery Essentials ("we", "us", or "our") collects, uses, discloses, and safeguards your information when you visit our website, including any other media form, media channel, mobile website, or mobile application related or connected to it.
            </p>
            
            <h2>Information We Collect</h2>
            <p>
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul>
              <li>Register for an account</li>
              <li>Subscribe to our newsletter</li>
              <li>Submit a contact form</li>
              <li>Participate in surveys or contests</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>
              The information we collect may be used to:
            </p>
            <ul>
              <li>Create and manage your account</li>
              <li>Send you product and service updates</li>
              <li>Respond to your inquiries</li>
              <li>Deliver targeted advertising</li>
              <li>Improve our website and services</li>
              <li>Send newsletters and promotional materials</li>
            </ul>
            
            <h2>Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our website and store certain information. These help us understand how you use our site, which pages you visit, and what links you click.
            </p>
            
            <h2>Third-Party Disclosure</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as described below:
            </p>
            <ul>
              <li>Service providers who assist us in operating our website</li>
              <li>Business partners with whom we jointly offer products or services</li>
              <li>When required by law or to protect our rights</li>
            </ul>
            
            <h2>Affiliate Disclosure</h2>
            <p>
              Our website contains affiliate links. If you click on an affiliate link and purchase a product, we will receive a commission. This helps support our website and allows us to continue to provide valuable content.
            </p>
            
            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>The right to access personal information we hold about you</li>
              <li>The right to request correction of inaccurate information</li>
              <li>The right to request deletion of your information</li>
              <li>The right to opt-out of marketing communications</li>
            </ul>
            
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@recoveryessentials.com.
            </p>
            
            <p className="text-gray-500 mt-10">Last Updated: May 1, 2023</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
