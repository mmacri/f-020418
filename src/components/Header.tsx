
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Settings, ChevronDown, User, LogOut } from "lucide-react";
import { getCurrentUser, logout, isAdmin } from "@/services/authService";
import { getNavigationCategories } from "@/services/categoryService";
import { Category } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBox } from "@/components/SearchBox";
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

  return (
    <header className="bg-background border-b shadow-sm py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded">
                <span className="text-primary-foreground font-bold">RE</span>
              </div>
              <div className="ml-2">
                <div className="font-bold text-foreground">Recovery Essentials</div>
                <div className="text-xs text-muted-foreground">Best Recovery Products & Reviews</div>
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
                    className="font-medium text-foreground hover:text-primary py-2 inline-flex items-center"
                  >
                    {category.name}
                    {category.subcategories.length > 0 && (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <ul className="absolute left-0 top-full bg-background border rounded-md shadow-md p-2 min-w-max hidden group-hover:block">
                      <li>
                        <Link 
                          to={`/categories/${category.slug}`} 
                          className="block px-4 py-2 text-foreground hover:bg-muted hover:text-primary rounded-md"
                        >
                          All {category.name}
                        </Link>
                      </li>
                      {category.subcategories.map((subcat) => (
                        <li key={subcat.id}>
                          <Link 
                            to={`/categories/${category.slug}/${subcat.slug}`} 
                            className="block px-4 py-2 text-foreground hover:bg-muted hover:text-primary rounded-md"
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
                <Link to="/blog" className="font-medium text-foreground hover:text-primary py-2 inline-block">
                  Blog
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center space-x-2">
            {/* Search Component */}
            <SearchBox variant="compact" />
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center rounded-full h-8 w-8 overflow-hidden border bg-primary text-primary-foreground hover:bg-primary/90">
                    <span className="sr-only">User menu</span>
                    <User className="h-4 w-4 mx-auto" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {user.name || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/wishlist')}>
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
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register" className="hidden sm:block">
                  <Button size="sm">Sign Up</Button>
                </Link>
                <Link to="/login" className="sm:hidden">
                  <Button size="icon" variant="outline" className="h-8 w-8">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
            <button 
              className="absolute top-4 right-4 text-foreground text-2xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✕
            </button>
            <ul className="flex flex-col space-y-4 text-center text-xl">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    to={`/categories/${category.slug}`} 
                    className="block py-2 text-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/blog" 
                  className="block py-2 text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="block py-2 text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
              </li>
              {!user && (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className="block py-2 text-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/register" 
                      className="block py-2 text-foreground hover:text-primary"
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
