
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "@/services/authService";
import { getNavigationCategories } from "@/services/categoryService";
import { Category } from "@/services/categoryService";
import { Logo } from "@/components/header/Logo";
import { NavigationMenuDesktop } from "@/components/header/NavigationMenuDesktop";
import { MobileMenu } from "@/components/header/MobileMenu";
import { HeaderActions } from "@/components/header/HeaderActions";

const MainHeader = () => {
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-background border-b shadow-sm py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Main Navigation Menu */}
          <NavigationMenuDesktop categories={categories} />

          {/* Header Actions (Search, Theme Toggle, User Menu) */}
          <HeaderActions 
            user={user} 
            onLogout={handleLogout} 
            toggleMobileMenu={toggleMobileMenu} 
          />
        </div>

        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
          categories={categories}
          user={user}
        />
      </div>
    </header>
  );
};

export default MainHeader;
