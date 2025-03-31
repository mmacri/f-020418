
import { Menu, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchBox } from "@/components/SearchBox";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/header/UserMenu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderActionsProps {
  user: any;
  onLogout: () => void;
  toggleMobileMenu: () => void;
}

export const HeaderActions = ({ user, onLogout, toggleMobileMenu }: HeaderActionsProps) => {
  // This would normally come from a cart state/context
  const cartItemCount = 0;

  return (
    <div className="flex items-center space-x-3">
      {/* Search Component */}
      <SearchBox variant="compact" />
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Shopping Cart */}
      <Link to="/cart" className="relative" aria-label="Shopping cart" title="View cart">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {cartItemCount}
            </Badge>
          )}
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
