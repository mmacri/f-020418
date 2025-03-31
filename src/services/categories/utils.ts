
import { SupabaseCategory } from './types';

// Helper function to process categories for hierarchy
export const processCategories = async (categories: SupabaseCategory[]) => {
  // Map to maintain O(1) lookups
  const categoryMap = new Map();
  
  // First pass: Create category objects and add to map
  categories.forEach(category => {
    categoryMap.set(category.id, {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.image_url,
      parentId: category.parent_id,
      show_in_navigation: category.show_in_navigation,
      navigationOrder: category.navigation_order,
      children: [],
      subcategories: []
    });
  });
  
  // Second pass: Build hierarchy
  const rootCategories = [];
  
  categories.forEach(category => {
    const categoryObject = categoryMap.get(category.id);
    
    if (category.parent_id && categoryMap.has(category.parent_id)) {
      // This is a child category
      const parentCategory = categoryMap.get(category.parent_id);
      parentCategory.children.push(categoryObject);
      parentCategory.subcategories.push(categoryObject);
    } else {
      // This is a root category
      rootCategories.push(categoryObject);
    }
  });
  
  return rootCategories;
};
