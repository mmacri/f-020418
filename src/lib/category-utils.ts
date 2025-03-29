import { getCategoryBySlug, getNavigationCategories, getSubcategoryBySlug } from "@/services/categoryService";

/**
 * Get a category by ID
 */
export const getCategoryById = async (categoryId: number) => {
  try {
    const categories = await getNavigationCategories();
    return categories.find(cat => cat.id === categoryId) || null;
  } catch (error) {
    console.error("Error getting category by ID:", error);
    return null;
  }
};

/**
 * Get subcategory by ID within a category
 */
export const getSubcategoryById = async (categoryId: number, subcategoryId: number) => {
  try {
    const category = await getCategoryById(categoryId);
    if (!category) return null;
    
    return category.subcategories.find(sub => sub.id === subcategoryId) || null;
  } catch (error) {
    console.error("Error getting subcategory by ID:", error);
    return null;
  }
};

/**
 * Get category and subcategory for a product
 */
export const getCategoryInfoForProduct = async (product: any) => {
  try {
    if (!product || !product.categoryId) return { category: null, subcategory: null };
    
    const category = await getCategoryById(product.categoryId);
    if (!category) return { category: null, subcategory: null };
    
    // Try to find matching subcategory either by ID or name
    let subcategory = null;
    
    if (product.subcategoryId) {
      subcategory = category.subcategories.find(sub => sub.id === product.subcategoryId);
    } else if (product.subcategory) {
      subcategory = category.subcategories.find(
        sub => sub.name.toLowerCase() === product.subcategory.toLowerCase() ||
               sub.slug === product.subcategory.toLowerCase().replace(/\s+/g, '-')
      );
    }
    
    return { category, subcategory };
  } catch (error) {
    console.error("Error getting category info for product:", error);
    return { category: null, subcategory: null };
  }
};

/**
 * Get a filtered list of categories for navigation
 */
export const getNavigationItems = async () => {
  try {
    const categories = await getNavigationCategories();
    
    // Only return categories that should be shown in navigation
    return categories
      .filter(cat => cat.showInNavigation !== false)
      .sort((a, b) => (a.navigationOrder || 0) - (b.navigationOrder || 0));
  } catch (error) {
    console.error("Error getting navigation items:", error);
    return [];
  }
};

/**
 * Generate breadcrumbs for a category or subcategory page
 */
export const generateCategoryBreadcrumbs = (category: any, subcategory?: any) => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
  ];
  
  if (category) {
    breadcrumbs.push({
      name: category.name,
      url: `/categories/${category.slug}`
    });
    
    if (subcategory) {
      breadcrumbs.push({
        name: subcategory.name,
        url: `/categories/${category.slug}/${subcategory.slug}`
      });
    }
  }
  
  return breadcrumbs;
};

/**
 * Get products for a subcategory
 */
export const getProductsForSubcategory = async (categorySlug: string, subcategorySlug: string) => {
  try {
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return [];
    
    const subcategory = category.subcategories.find(sub => sub.slug === subcategorySlug);
    if (!subcategory) return [];
    
    // Implementation would vary based on your product service
    // This is a placeholder that would need to be replaced with actual implementation
    return [];
  } catch (error) {
    console.error("Error getting products for subcategory:", error);
    return [];
  }
};

/**
 * Get subcategory details
 */
export const getSubcategoryDetails = async (categorySlug: string, subcategorySlug: string) => {
  try {
    const result = await getSubcategoryBySlug(categorySlug, subcategorySlug);
    return result;
  } catch (error) {
    console.error("Error getting subcategory details:", error);
    return null;
  }
};
