
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, User, ChevronDown } from "lucide-react";

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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li className="relative group">
                <Link to="/categories/massage-guns" className="font-medium text-gray-700 hover:text-indigo-600 py-2 inline-flex items-center">
                  Massage Guns <ChevronDown className="ml-1 h-4 w-4" />
                </Link>
                <ul className="absolute left-0 top-full bg-white border rounded-md shadow-md p-2 min-w-max hidden group-hover:block">
                  <li><Link to="/categories/professional-massage-guns" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md">Professional</Link></li>
                  <li><Link to="/categories/home-massage-guns" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md">Home Use</Link></li>
                </ul>
              </li>
              <li><Link to="/categories/foam-rollers" className="font-medium text-gray-700 hover:text-indigo-600 py-2 inline-block">Foam Rollers</Link></li>
              <li className="relative group">
                <Link to="/categories/compression-gear" className="font-medium text-gray-700 hover:text-indigo-600 py-2 inline-flex items-center">
                  Compression Gear <ChevronDown className="ml-1 h-4 w-4" />
                </Link>
                <ul className="absolute left-0 top-full bg-white border rounded-md shadow-md p-2 min-w-max hidden group-hover:block">
                  <li><Link to="/categories/compression-socks" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md">Compression Socks</Link></li>
                  <li><Link to="/categories/compression-sleeves" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md">Compression Sleeves</Link></li>
                  <li><Link to="/categories/compression-tights" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md">Compression Tights</Link></li>
                </ul>
              </li>
              <li><Link to="/categories/fitness-bands" className="font-medium text-gray-700 hover:text-indigo-600 py-2 inline-block">Fitness Bands</Link></li>
            </ul>
          </nav>

          <div className="hidden md:flex items-center">
            <button className="text-gray-700 hover:text-indigo-600 mr-4">
              <Search size={20} />
            </button>
            <button className="text-gray-700 hover:text-indigo-600">
              <User size={20} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-2 border-t">
            <ul className="space-y-2">
              <li>
                <Link to="/categories/massage-guns" className="block font-medium text-gray-700 hover:text-indigo-600 py-2">
                  Massage Guns
                </Link>
                <ul className="pl-4 space-y-1 mt-1">
                  <li><Link to="/categories/professional-massage-guns" className="block text-gray-700 hover:text-indigo-600 py-1">Professional</Link></li>
                  <li><Link to="/categories/home-massage-guns" className="block text-gray-700 hover:text-indigo-600 py-1">Home Use</Link></li>
                </ul>
              </li>
              <li><Link to="/categories/foam-rollers" className="block font-medium text-gray-700 hover:text-indigo-600 py-2">Foam Rollers</Link></li>
              <li>
                <Link to="/categories/compression-gear" className="block font-medium text-gray-700 hover:text-indigo-600 py-2">
                  Compression Gear
                </Link>
                <ul className="pl-4 space-y-1 mt-1">
                  <li><Link to="/categories/compression-socks" className="block text-gray-700 hover:text-indigo-600 py-1">Compression Socks</Link></li>
                  <li><Link to="/categories/compression-sleeves" className="block text-gray-700 hover:text-indigo-600 py-1">Compression Sleeves</Link></li>
                  <li><Link to="/categories/compression-tights" className="block text-gray-700 hover:text-indigo-600 py-1">Compression Tights</Link></li>
                </ul>
              </li>
              <li><Link to="/categories/fitness-bands" className="block font-medium text-gray-700 hover:text-indigo-600 py-2">Fitness Bands</Link></li>
            </ul>
            <div className="flex mt-4 pt-2 border-t">
              <button className="text-gray-700 hover:text-indigo-600 mr-4">
                <Search size={20} />
              </button>
              <button className="text-gray-700 hover:text-indigo-600">
                <User size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
