
import { Menu, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchBox } from "@/components/SearchBox";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/header/UserMenu";
import { Button } from "@/components/ui/button";

interface HeaderActionsProps {
  user: any;
  onLogout: () => void;
  toggleMobileMenu: () => void;
}

export const HeaderActions = ({ user, onLogout, toggleMobileMenu }: HeaderActionsProps) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Search Component */}
      <SearchBox variant="compact" />
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Wishlist */}
      <Link to="/wishlist" className="relative" aria-label="Saved products" title="View saved products">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bookmark className="h-5 w-5" />
        </Button>
      </Link>
      
      {/* User Menu */}
      <UserMenu user={user} onLogout={onLogout} />

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden text-foreground hover:text-primary"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
        title="Toggle mobile menu"
      >
        <Menu size={20} aria-hidden="true" />
      </button>
    </div>
  );
};
