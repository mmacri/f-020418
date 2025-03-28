
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, BookOpen } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Information */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-indigo-600 flex items-center justify-center rounded">
                <span className="text-white font-bold">RE</span>
              </div>
              <div className="ml-2">
                <div className="font-bold">Recovery Essentials</div>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Providing science-backed recommendations for the best fitness recovery products on the market.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <BookOpen size={20} />
              </a>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-lg font-bold mb-6">Product Categories</h3>
            <ul className="space-y-3">
              <li><Link to="/categories/massage-guns" className="text-gray-400 hover:text-white transition">Massage Guns</Link></li>
              <li><Link to="/categories/foam-rollers" className="text-gray-400 hover:text-white transition">Foam Rollers</Link></li>
              <li><Link to="/categories/fitness-bands" className="text-gray-400 hover:text-white transition">Fitness Bands</Link></li>
              <li><Link to="/categories/compression-gear" className="text-gray-400 hover:text-white transition">Compression Gear</Link></li>
              <li><Link to="/products/comparison" className="text-gray-400 hover:text-white transition">Product Comparisons</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-6">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition">Recovery Blog</Link></li>
              <li><Link to="/blog/foam-rolling-guide" className="text-gray-400 hover:text-white transition">Guides</Link></li>
              <li><Link to="/products/comparison" className="text-gray-400 hover:text-white transition">Comparisons</Link></li>
              <li><Link to="/recovery-apps" className="text-gray-400 hover:text-white transition">Recovery Apps</Link></li>
              <li><Link to="/newsletter" className="text-gray-400 hover:text-white transition">Newsletter</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-6">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/affiliate-disclosure" className="text-gray-400 hover:text-white transition">Affiliate Disclosure</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-gray-400 text-sm">
          <p>&copy; {currentYear} Recovery Essentials. All rights reserved.</p>
          <p className="mt-2">Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
