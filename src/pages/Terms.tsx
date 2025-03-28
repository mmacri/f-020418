
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Please read these terms carefully before using our website.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose lg:prose-xl">
            <h2>Introduction</h2>
            <p>
              These Terms of Service ("Terms") govern your access to and use of the Recovery Essentials website, including any content, functionality, and services offered on or through the website.
            </p>
            
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing or using our website, you agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the website.
            </p>
            
            <h2>Changes to Terms</h2>
            <p>
              We may revise these Terms at any time by updating this page. By continuing to use the website after those revisions become effective, you agree to be bound by the revised Terms.
            </p>
            
            <h2>User Content</h2>
            <p>
              Our website may allow you to post, link, store, share, and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content you post to the website.
            </p>
            
            <h2>Intellectual Property</h2>
            <p>
              The website and its original content, features, and functionality are owned by Recovery Essentials and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            
            <h2>Affiliate Disclosure</h2>
            <p>
              Recovery Essentials participates in various affiliate marketing programs, which means we may earn commissions on products purchased through our links to retailer sites.
            </p>
            
            <h2>Limitation of Liability</h2>
            <p>
              In no event shall Recovery Essentials, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the website.
            </p>
            
            <h2>Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Recovery Essentials and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).
            </p>
            
            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws applicable in the United States, without regard to its conflict of law provisions.
            </p>
            
            <h2>Severability</h2>
            <p>
              If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at terms@recoveryessentials.com.
            </p>
            
            <p className="text-gray-500 mt-10">Last Updated: May 1, 2023</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
