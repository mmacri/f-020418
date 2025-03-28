
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Settings, ChevronDown, User, LogOut, ShoppingCart } from "lucide-react";
import { getCurrentUser, logout, isAdmin } from "@/services/authService";
import { getNavigationCategories } from "@/services/categoryService";
import { Category } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBox } from "@/components/SearchBox";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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
        // Only show categories marked for navigation display, sorted by navigation order
        const visibleCategories = navCategories
          .filter(cat => cat.showInNavigation !== false)
          .sort((a, b) => (a.navigationOrder || 0) - (b.navigationOrder || 0));
        setCategories(visibleCategories);
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

          {/* Main Navigation using ShadCN NavigationMenu */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {categories.map((category) => (
                  <NavigationMenuItem key={category.id}>
                    {category.subcategories && category.subcategories.length > 0 ? (
                      <>
                        <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            <li className="row-span-3">
                              <NavigationMenuLink asChild>
                                <Link
                                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                  to={`/categories/${category.slug}`}
                                >
                                  <div className="mb-2 mt-4 text-lg font-medium">
                                    All {category.name}
                                  </div>
                                  <p className="text-sm leading-tight text-muted-foreground">
                                    {category.description || `Browse all ${category.name.toLowerCase()} products`}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                            {category.subcategories.map((subcategory) => (
                              <li key={subcategory.id}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    to={`/categories/${category.slug}/${subcategory.slug}`}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="text-sm font-medium leading-none">{subcategory.name}</div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {subcategory.description || `${subcategory.name} recovery products`}
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link to={`/categories/${category.slug}`} className={navigationMenuTriggerStyle()}>
                        {category.name}
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                  <Link to="/blog" className={navigationMenuTriggerStyle()}>
                    Blog
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search Component */}
            <SearchBox variant="compact" />
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Cart Link */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">0</span>
              </Button>
            </Link>
            
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
                  {category.subcategories && category.subcategories.length > 0 && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {category.subcategories.map(subcat => (
                        <li key={subcat.id}>
                          <Link 
                            to={`/categories/${category.slug}/${subcat.slug}`} 
                            className="block py-1 text-sm text-gray-600 hover:text-primary"
                            onClick={() => setMobileMenuOpen(false)}
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
