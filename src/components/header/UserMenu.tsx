
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { User, LogOut, Settings, Heart, ShoppingBag, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserMenuProps {
  user: any;
  onLogout: () => void;
}

export const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  const navigate = useNavigate();
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const isAdmin = user?.role === 'admin';
  console.log("UserMenu - User role:", user?.role, "Is admin:", isAdmin);

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-9 w-9 overflow-hidden"
          aria-label="User menu"
          title="User menu"
        >
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name || "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.name || user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-semibold">{user.name || "User"}</span>
          <span className="text-xs text-muted-foreground truncate">{user.email}</span>
          {isAdmin && <span className="text-xs text-blue-600 mt-1">Administrator</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')} className="gap-2 cursor-pointer">
          <UserCircle size={16} aria-hidden="true" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/orders')} className="gap-2 cursor-pointer">
          <ShoppingBag size={16} aria-hidden="true" />
          <span>My Orders</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/wishlist')} className="gap-2 cursor-pointer">
          <Heart size={16} aria-hidden="true" />
          <span>Saved Products</span>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate('/admin')} className="gap-2 cursor-pointer">
            <Settings size={16} aria-hidden="true" />
            <span>Admin Dashboard</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="gap-2 cursor-pointer text-destructive">
          <LogOut size={16} aria-hidden="true" />
          <span>Logout</span>
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
