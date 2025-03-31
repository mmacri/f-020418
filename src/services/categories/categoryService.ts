
import { supabase } from '@/integrations/supabase/client';
import { DEFAULT_CATEGORIES } from './constants';
import { processCategories } from './utils';
import { Category, CategoryInput, Subcategory, SupabaseCategory } from './types';

/**
 * Get all categories with their subcategories
 */
export const getCategoriesWithSubcategories = async (): Promise<Category[]> => {
  try {
    // Try to get parent categories from Supabase
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .order('navigation_order', { ascending: true });
    
    if (error) {
      console.error("Error getting categories from Supabase:", error);
      return DEFAULT_CATEGORIES;
    }
    
    // Process categories to get subcategories
    const categoriesWithSubcategories = await Promise.all(
      (categories as SupabaseCategory[]).map(async (category) => {
        // Get subcategories for this category
        const { data: subcategories, error: subError } = await supabase
          .from('categories')
          .select('*')
          .eq('parent_id', category.id)
          .order('name');
        
        if (subError) {
          console.error(`Error getting subcategories for ${category.name}:`, subError);
          return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            imageUrl: category.image_url,
            showInNavigation: category.show_in_navigation,
            navigationOrder: category.navigation_order,
            subcategories: []
          };
        }
        
        // Map to our Subcategory interface
        const mappedSubcategories = (subcategories as SupabaseCategory[]).map(sub => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          imageUrl: sub.image_url,
          showInNavigation: sub.show_in_navigation
        }));
        
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          imageUrl: category.image_url,
          showInNavigation: category.show_in_navigation, 
          navigationOrder: category.navigation_order,
          subcategories: mappedSubcategories
        };
      })
    );
    
    return categoriesWithSubcategories;
  } catch (error) {
    console.error("Error getting categories:", error);
    return DEFAULT_CATEGORIES;
  }
};

/**
 * Get categories for navigation
 */
export const getNavigationCategories = async () => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('navigation_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching navigation categories:', error);
      return [];
    }

    // Process categories to build a hierarchical structure
    const categoriesWithChildren = await processCategories(categories as SupabaseCategory[]);
    
    // Only include categories marked for navigation
    const navigationCategories = categoriesWithChildren.filter(
      category => category.show_in_navigation !== false
    );
    
    return navigationCategories;
  } catch (error) {
    console.error('Error in getNavigationCategories:', error);
    return [];
  }
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    // Try to get from Supabase first
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .is('parent_id', null) // Ensure it's a parent category, not a subcategory
      .single();
    
    if (error) {
      console.error(`Error getting category with slug ${slug} from Supabase:`, error);
      // Fall back to local cache
      const categories = await getCategoriesWithSubcategories();
      return categories.find(category => category.slug === slug) || null;
    }
    
    // Get subcategories for this category
    const { data: subcategories, error: subError } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', category.id)
      .order('name');
    
    if (subError) {
      console.error(`Error getting subcategories for ${category.name}:`, subError);
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.image_url,
        showInNavigation: category.show_in_navigation,
        navigationOrder: category.navigation_order,
        subcategories: []
      };
    }
    
    // Map to our Subcategory interface
    const mappedSubcategories = (subcategories as SupabaseCategory[]).map(sub => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      description: sub.description,
      imageUrl: sub.image_url,
      showInNavigation: sub.show_in_navigation
    }));
    
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.image_url,
      showInNavigation: category.show_in_navigation,
      navigationOrder: category.navigation_order,
      subcategories: mappedSubcategories
    };
  } catch (error) {
    console.error(`Error getting category with slug ${slug}:`, error);
    // Check default categories as fallback
    return DEFAULT_CATEGORIES.find(category => category.slug === slug) || null;
  }
};

/**
 * Get subcategory by slug within a category
 */
export const getSubcategoryBySlug = async (categorySlug: string, subcategorySlug: string): Promise<{category: Category, subcategory: Subcategory} | null> => {
  try {
    // Get the parent category first
    const category = await getCategoryBySlug(categorySlug);
    if (!category || !category.subcategories) return null;
    
    // Find the subcategory within the parent
    const subcategory = category.subcategories.find(sub => sub.slug === subcategorySlug);
    if (!subcategory) return null;
    
    return { category, subcategory };
  } catch (error) {
    console.error(`Error getting subcategory with slug ${subcategorySlug}:`, error);
    return null;
  }
};
