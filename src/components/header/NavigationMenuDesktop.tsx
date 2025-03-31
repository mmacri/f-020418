
import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Category } from "@/services/categoryService";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface NavigationMenuDesktopProps {
  categories: Category[];
}

export const NavigationMenuDesktop = ({ categories }: NavigationMenuDesktopProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              isActive("/") ? "bg-accent text-accent-foreground" : ""
            )}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        {categories.map((category) => (
          <NavigationMenuItem key={category.id}>
            {category.subcategories && category.subcategories.length > 0 ? (
              <>
                <NavigationMenuTrigger className={cn(
                  isActive(`/categories/${category.slug}`) ? "bg-accent text-accent-foreground" : ""
                )}>
                  {category.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px] grid-cols-2">
                    <li className="col-span-2">
                      <NavigationMenuLink asChild>
                        <Link
                          to={`/categories/${category.slug}`}
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            {category.name} Overview
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Browse all {category.name.toLowerCase()} products and find the best options for your recovery needs.
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
                              {subcategory.description || `Explore ${subcategory.name} products and options.`}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Link to={`/categories/${category.slug}`}>
                <NavigationMenuLink className={cn(
                  navigationMenuTriggerStyle(),
                  isActive(`/categories/${category.slug}`) ? "bg-accent text-accent-foreground" : ""
                )}>
                  {category.name}
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
        
        <NavigationMenuItem>
          <Link to="/blog">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              isActive("/blog") ? "bg-accent text-accent-foreground" : ""
            )}>
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
