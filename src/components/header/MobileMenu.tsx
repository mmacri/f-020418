
import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Category } from "@/services/categoryService";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  user: any;
}

export const MobileMenu = ({ isOpen, onClose, categories, user }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <button 
        className="absolute top-4 right-4 text-foreground text-2xl"
        onClick={onClose}
        aria-label="Close mobile menu"
        title="Close mobile menu"
      >
        <X size={24} aria-hidden="true" />
      </button>
      <ul className="flex flex-col space-y-4 text-center text-xl">
        {categories.map((category) => (
          <li key={category.id}>
            <Link 
              to={`/categories/${category.slug}`} 
              className="block py-2 text-foreground hover:text-primary"
              onClick={onClose}
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
                      onClick={onClose}
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
            onClick={onClose}
          >
            Blog
          </Link>
        </li>
        <li>
          <Link 
            to="/profile" 
            className="block py-2 text-foreground hover:text-primary"
            onClick={onClose}
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
                onClick={onClose}
              >
                Login
              </Link>
            </li>
            <li>
              <Link 
                to="/register" 
                className="block py-2 text-foreground hover:text-primary"
                onClick={onClose}
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};
