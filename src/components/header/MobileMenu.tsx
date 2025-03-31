
import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ChevronDown, ChevronRight, Home, ShoppingBag, Heart, User, Settings, LogOut, Search } from "lucide-react";
import { Category } from "@/services/categoryService";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchBox } from "@/components/SearchBox";
import { isAdmin } from "@/services/authService";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  user: any;
}

export const MobileMenu = ({ isOpen, onClose, categories, user }: MobileMenuProps) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const handleLogout = async () => {
    // Implement logout functionality
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="h-[100dvh] max-w-full p-0 border-none shadow-none sm:max-w-sm md:max-w-md">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <Link to="/" onClick={onClose} className="font-bold text-xl">
              Recovery Essentials
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X size={24} aria-hidden="true" />
            </Button>
          </div>

          <div className="p-4 border-b">
            <SearchBox 
              variant="full" 
              placeholder="Search products..." 
              className="w-full"
              onSearch={() => onClose()}
            />
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              <Link
                to="/"
                className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                onClick={onClose}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>

              <div className="mt-4 mb-2 font-semibold text-lg">Categories</div>
              <Accordion
                type="single"
                collapsible
                value={openAccordion || undefined}
                onValueChange={(value) => setOpenAccordion(value)}
                className="space-y-2"
              >
                {categories.map((category) => (
                  <AccordionItem
                    key={category.id}
                    value={category.id.toString()}
                    className="border rounded-md overflow-hidden"
                  >
                    <AccordionTrigger className="px-3 py-2 hover:bg-accent hover:no-underline">
                      <div className="flex items-center gap-2">
                        <span>{category.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <div className="pl-4 space-y-1">
                        <Link
                          to={`/categories/${category.slug}`}
                          className="block p-2 hover:bg-accent rounded-md text-sm"
                          onClick={onClose}
                        >
                          View All {category.name}
                        </Link>
                        {category.subcategories?.map((subcat) => (
                          <Link
                            key={subcat.id}
                            to={`/categories/${category.slug}/${subcat.slug}`}
                            className="block p-2 hover:bg-accent rounded-md text-sm"
                            onClick={onClose}
                          >
                            {subcat.name}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-6 space-y-2">
                <Link
                  to="/blog"
                  className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                  onClick={onClose}
                >
                  <span>Blog</span>
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                  onClick={onClose}
                >
                  <span>Contact</span>
                </Link>
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="font-medium">{user.name || user.email}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    onClick={onClose}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    onClick={onClose}
                  >
                    <ShoppingBag size={16} />
                    <span>Orders</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    onClick={onClose}
                  >
                    <Heart size={16} />
                    <span>Wishlist</span>
                  </Link>
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                      onClick={onClose}
                    >
                      <Settings size={16} />
                      <span>Admin</span>
                    </Link>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-2 flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={onClose}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/register" onClick={onClose}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
