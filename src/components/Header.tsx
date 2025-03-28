import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Settings, ChevronDown, User, LogOut } from "lucide-react";
import { getCurrentUser, logout, isAdmin } from "@/services/userService";
import { getNavigationCategories } from "@/services/categoryService";
import { Category } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const navCategories = await getNavigationCategories();
        setCategories(navCategories);
      } catch (error) {
        console.error("Error fetching navigation categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

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
              {categories.map((category) => (
                <li key={category.id} className="relative group">
                  <Link 
                    to={`/categories/${category.slug}`} 
                    className="font-medium text-gray-700 hover:text-indigo-600 py-2 inline-flex items-center"
                  >
                    {category.name}
                    {category.subcategories.length > 0 && (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <ul className="absolute left-0 top-full bg-white border rounded-md shadow-md p-2 min-w-max hidden group-hover:block">
                      <li>
                        <Link 
                          to={`/categories/${category.slug}`} 
                          className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                        >
                          All {category.name}
                        </Link>
                      </li>
                      {category.subcategories.map((subcat) => (
                        <li key={subcat.id}>
                          <Link 
                            to={`/categories/${category.slug}/${subcat.slug}`} 
                            className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                          >
                            {subcat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li>
                <Link to="/blog" className="font-medium text-gray-700 hover:text-indigo-600 py-2 inline-block">
                  Blog
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center">
            {/* Search Button */}
            <button 
              className="text-gray-700 hover:text-indigo-600 mr-4"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={20} />
            </button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-700 hover:text-indigo-600 mr-4 flex items-center">
                    <User size={20} />
                    <span className="ml-2 hidden md:inline-block">{user.name.split(' ')[0]}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/favorites')}>
                    Saved Products
                  </DropdownMenuItem>
                  {isAdmin() && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings size={16} className="mr-2" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center">
                <Link to="/login" className="mr-2">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register" className="hidden md:block">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-gray-700 hover:text-indigo-600 ml-4"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="absolute inset-x-0 top-full mt-2 px-4 pb-4">
            <form onSubmit={handleSearch} className="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border">
              <div className="flex items-center p-2">
                <Search className="h-5 w-5 text-gray-400 ml-2" />
                <input
                  type="text"
                  placeholder="Search products, articles..."
                  className="flex-1 px-4 py-2 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button 
                  type="button" 
                  className="text-gray-500 hover:text-gray-700 p-2"
                  onClick={() => setSearchOpen(false)}
                >
                  ✕
                </button>
              </div>
            </form>
          </div>
        )}

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
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    to={`/categories/${category.slug}`} 
                    className="block py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/blog" 
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
              {!user && (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className="block py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/register" 
                      className="block py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
