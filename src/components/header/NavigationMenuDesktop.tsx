
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

interface NavigationMenuDesktopProps {
  categories: Category[];
}

export const NavigationMenuDesktop = ({ categories }: NavigationMenuDesktopProps) => {
  const location = useLocation();

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const isActiveCategoryLink = (slug: string) => {
    return location.pathname.includes(`/categories/${slug}`);
  };

  return (
    <div className="hidden md:block">
      <NavigationMenu>
        <NavigationMenuList>
          {categories.map((category) => (
            <NavigationMenuItem key={category.id}>
              {category.subcategories && category.subcategories.length > 0 ? (
                <>
                  <NavigationMenuTrigger 
                    className={isActiveCategoryLink(category.slug) ? "bg-accent text-accent-foreground" : ""}
                  >
                    {category.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            to={`/categories/${category.slug}`}
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              All {category.name}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              {category.description || `Browse all ${category.name.toLowerCase()} products`}
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
                                {subcategory.description || `${subcategory.name} recovery products`}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <Link 
                  to={`/categories/${category.slug}`} 
                  className={`${navigationMenuTriggerStyle()} ${
                    isActiveCategoryLink(category.slug) ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
                  {category.name}
                </Link>
              )}
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <Link 
              to="/blog" 
              className={`${navigationMenuTriggerStyle()} ${
                isActiveLink("/blog") ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              Blog
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
