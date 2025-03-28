
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, Settings, ChevronDown } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-indigo-600 flex items-center justify-center rounded">
                <span className="text-white font-bold">RE</span>
              </div>
              <div className="ml-2">
                <div className="font-bold text-gray-800">Recovery Essentials</div>
                <div className="text-xs text-gray-500">Best Recovery Products & Reviews</div>
              </div>
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:block" id="main-navigation">
            <ul className="flex space-x-6">
              <li className="relative group">
                <Link to="/categories/massage-guns" className="font-medium text-gray-700 hover:text-indigo-600 py-2 inline-flex items-center">
                  Massage Guns <ChevronDown className="ml-1 h-4 w-4" />
                </Link>
                <ul className="absolute left-0 top-full bg-white border rounded-md shadow-md p-2 min-w-max hidden group-hover:block">
                  <li>
                    <Link to="/categories/massage-guns" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md">
                      All Massage Guns
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/categories/foam-rollers" className="font-medium text-gray-700 hover:text-indigo-600 py-2 inline-block">
                  Foam Rollers
                </Link>
              </li>
              <li>
                <Link to="/categories/fitness-bands" className="font-medium text-gray-700 hover:text-indigo-600 py-2 inline-block">
                  Fitness Bands
                </Link>
              </li>
              <li>
                <Link to="/categories/compression-gear" className="font-medium text-gray-700 hover:text-indigo-600 py-2 inline-block">
                  Compression Gear
                </Link>
              </li>
              <li>
                <Link to="/blog" className="font-medium text-gray-700 hover:text-indigo-600 py-2 inline-block">
                  Blog
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center">
            <button className="text-gray-700 hover:text-indigo-600 mr-4">
              <Search size={20} />
            </button>
            <Link to="/admin" className="text-gray-700 hover:text-indigo-600 mr-4" title="Admin Dashboard">
              <Settings size={20} />
            </Link>
            <button 
              className="md:hidden text-gray-700 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex items-center justify-center">
            <button 
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✕
            </button>
            <ul className="flex flex-col space-y-4 text-white text-center text-xl">
              <li>
                <Link 
                  to="/categories/massage-guns" 
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Massage Guns
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/foam-rollers" 
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Foam Rollers
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/fitness-bands" 
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Fitness Bands
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/compression-gear" 
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Compression Gear
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
