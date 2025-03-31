
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";
import { isAdmin, logout } from "@/services/authService";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user: any;
  onLogout: () => void;
}

export const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  const navigate = useNavigate();

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="flex items-center rounded-full h-8 w-8 overflow-hidden border bg-primary text-primary-foreground hover:bg-primary/90"
          aria-label="User menu"
          title="User menu"
        >
          <span className="sr-only">User menu</span>
          <User className="h-4 w-4 mx-auto" aria-hidden="true" />
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
            <Settings size={16} className="mr-2" aria-hidden="true" />
            Admin Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut size={16} className="mr-2" aria-hidden="true" />
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
      <Link to="/login" className="sm:hidden" title="Login" aria-label="Login">
        <Button size="icon" variant="outline" className="h-8 w-8">
          <User className="h-4 w-4" aria-hidden="true" />
        </Button>
      </Link>
    </div>
  );
};
