
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AffiliateDisclosure = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Affiliate Disclosure</h1>
          <p className="text-xl max-w-3xl mx-auto">
            How we earn money and maintain our commitment to honest, unbiased recommendations.
          </p>
        </div>
      </section>

      {/* Disclosure Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose lg:prose-xl">
            <h2>What Is Affiliate Marketing?</h2>
            <p>
              Affiliate marketing is a way for websites like ours to earn money by promoting products from other companies. When you click on one of our affiliate links and purchase a product, we receive a small commission from the retailer at no additional cost to you.
            </p>
            
            <h2>Our Affiliate Relationships</h2>
            <p>
              Recovery Essentials participates in affiliate programs with the following companies:
            </p>
            <ul>
              <li>Amazon Associates</li>
              <li>Rogue Fitness</li>
              <li>Theragun</li>
              <li>Under Armour</li>
              <li>Nike</li>
              <li>And other fitness and recovery product brands</li>
            </ul>
            
            <h2>How We Use Affiliate Links</h2>
            <p>
              Our website contains affiliate links in the following places:
            </p>
            <ul>
              <li>Product reviews</li>
              <li>Buying guides</li>
              <li>Product comparisons</li>
              <li>"Best of" lists</li>
              <li>Blog posts about specific products</li>
            </ul>
            
            <h2>Our Commitment to You</h2>
            <p>
              While we do earn money through affiliate marketing, we maintain a strict editorial policy:
            </p>
            <ul>
              <li><strong>Honest Opinions:</strong> Our product evaluations and recommendations are based on thorough research, testing when possible, and analysis of customer feedback—not on which companies offer affiliate programs.</li>
              <li><strong>No Pay for Play:</strong> We never accept payment for positive reviews. Our opinions are our own.</li>
              <li><strong>Transparency:</strong> We always disclose our affiliate relationships clearly.</li>
              <li><strong>Your Needs First:</strong> Our primary goal is to help you find the best products for your specific needs, not to maximize our commissions.</li>
            </ul>
            
            <h2>Why We Use Affiliate Links</h2>
            <p>
              Affiliate marketing allows us to:
            </p>
            <ul>
              <li>Maintain our website and continue creating high-quality content</li>
              <li>Keep our content free for all readers without relying on intrusive advertisements</li>
              <li>Spend time thoroughly researching products to provide valuable information</li>
              <li>Support our team of writers, editors, and product testers</li>
            </ul>
            
            <h2>Identifying Affiliate Links</h2>
            <p>
              You can identify our affiliate links in several ways:
            </p>
            <ul>
              <li>We include a disclosure statement at the top of content that contains affiliate links</li>
              <li>Links that take you directly to product pages on retailer websites are typically affiliate links</li>
              <li>Links with "tag=" or similar parameters in the URL are affiliate links</li>
            </ul>
            
            <h2>Questions About Our Affiliate Relationships?</h2>
            <p>
              If you have any questions about our affiliate relationships or how we select products to recommend, please contact us at affiliates@recoveryessentials.com.
            </p>
            
            <p className="text-gray-500 mt-10">Last Updated: May 1, 2023</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AffiliateDisclosure;
