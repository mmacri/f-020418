
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Heart } from 'lucide-react';
import { useTheme } from "@/components/ThemeProvider";
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from '@/components/ThemeToggle';
import { DEFAULT_NAVIGATION } from '@/lib/constants';
import { isAdmin, isAuthenticated, logout } from '@/services/authService';

interface NavItem {
  id: number;
  title: string;
  type: "link" | "category-dropdown" | "button";
  url?: string;
  showInHeader: boolean;
  items?: {
    id: number;
    title: string;
    url?: string;
    type?: string;
    showInHeader?: boolean;
  }[];
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mainMenu, setMainMenu] = useState<NavItem[]>([]);
  const { theme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    // Convert DEFAULT_NAVIGATION.mainMenu to NavItem[]
    if (DEFAULT_NAVIGATION.mainMenu) {
      const transformedMenu: NavItem[] = DEFAULT_NAVIGATION.mainMenu.map((item, index) => ({
        id: index + 1,
        title: item.name,
        type: "link",
        url: item.href,
        showInHeader: true
      }));
      setMainMenu(transformedMenu);
    }

    // Example: Load categories dynamically (replace with your actual data fetching)
    const fetchCategories = async () => {
      // Simulate fetching categories from an API
      const categories = [
        { id: 101, title: "Massage Guns", url: "/categories/massage-guns" },
        { id: 102, title: "Foam Rollers", url: "/categories/foam-rollers" },
        { id: 103, title: "Compression Gear", url: "/categories/compression-gear" },
        { id: 104, title: "Resistance Bands", url: "/categories/resistance-bands" },
        { id: 105, title: "Recovery Tech", url: "/categories/recovery-tech" }
      ];

      // Update the main menu with category items
      setMainMenu(prevMenu => {
        return prevMenu.map(item => {
          if (item.type === "category-dropdown") {
            return { ...item, items: categories.map(cat => ({ ...cat, type: "link", showInHeader: false })) };
          }
          return item;
        });
      });
    };

    fetchCategories();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  const renderAuthButtons = () => {
    if (isAdmin()) {
      return (
        <div className="flex items-center gap-2">
          <Link to="/admin" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Admin Dashboard
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="text-sm font-medium"
            onClick={handleLogout}
            aria-label="Sign out of admin account"
          >
            Sign Out
          </Button>
        </div>
      );
    }
    
    // Only show login button if not authenticated, and only for admin
    if (!isAuthenticated()) {
      return (
        <div className="hidden sm:flex items-center">
          <Link to="/login" className="text-sm">
            <Button variant="ghost" size="sm" aria-label="Admin login">
              Admin Login
            </Button>
          </Link>
        </div>
      );
    }
    
    return null;
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container flex justify-between items-center py-4 px-4">
        <Link to="/" className="font-bold text-xl">
          Recovery Essentials
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {mainMenu.map(item => (
            item.showInHeader && (
              item.type === "link" ? (
                <NavLink
                  key={item.id}
                  to={item.url || "/"}
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-gray-900 font-medium"
                  }
                >
                  {item.title}
                </NavLink>
              ) : item.type === "category-dropdown" && item.items ? (
                <div key={item.id} className="relative group">
                  <button 
                    className="text-gray-700 hover:text-gray-900 font-medium"
                    aria-label={`${item.title} dropdown menu`}
                    title={`${item.title} categories`}
                  >
                    {item.title}
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-md hidden group-hover:block z-50">
                    {item.items.map(subItem => (
                      <Link
                        key={subItem.id}
                        to={subItem.url || "/"}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-medium"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null
            )
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/search" aria-label="Search products" title="Search products">
            <Search className="h-5 w-5 text-gray-700 hover:text-gray-900" aria-hidden="true" />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist" title="View wishlist">
            <Heart className="h-5 w-5 text-gray-700 hover:text-gray-900" aria-hidden="true" />
          </Link>
          <ThemeToggle />
          {renderAuthButtons()}

          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden"
                aria-label="Open menu"
                title="Menu"
              >
                <Menu className="h-5 w-5 text-gray-700 hover:text-gray-900" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through Recovery Essentials
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                {mainMenu.map(item => (
                  <div key={item.id} className="py-2">
                    {item.type === "link" && (
                      <Link
                        to={item.url || "/"}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-medium"
                      >
                        {item.title}
                      </Link>
                    )}
                    {item.type === "category-dropdown" && item.items && (
                      <div>
                        <div className="px-4 py-2 font-semibold text-gray-700">{item.title}</div>
                        {item.items.map(subItem => (
                          <Link
                            key={subItem.id}
                            to={subItem.url || "/"}
                            className="block px-6 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-medium"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
