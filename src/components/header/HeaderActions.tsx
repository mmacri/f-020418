
import { Menu } from "lucide-react";
import { SearchBox } from "@/components/SearchBox";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/header/UserMenu";

interface HeaderActionsProps {
  user: any;
  onLogout: () => void;
  toggleMobileMenu: () => void;
}

export const HeaderActions = ({ user, onLogout, toggleMobileMenu }: HeaderActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      {/* Search Component */}
      <SearchBox variant="compact" />
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
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
