import { supabase } from '@/integrations/supabase/client';
import { localStorageKeys } from '@/lib/constants';

// Define proper types for our data
export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  showInNavigation?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  showInNavigation?: boolean;
  navigationOrder?: number;
  subcategories?: Subcategory[];
}

// Define interface for category input
export interface CategoryInput {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  showInNavigation?: boolean;
  navigationOrder?: number;
}

// Define the shape of Supabase category data
interface SupabaseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  show_in_navigation?: boolean;
  navigation_order?: number;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

// Define default categories to use when none exist or for fallback
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Massage Guns",
    slug: "massage-guns",
    description: "Percussive therapy devices to relieve muscle tension and improve recovery",
    imageUrl: "https://ext.same-assets.com/1001010126/massage-gun-category.jpg",
    showInNavigation: true,
    navigationOrder: 1,
    subcategories: [
      {
        id: "1-1",
        name: "Professional Grade",
        slug: "professional-grade",
        description: "High-powered massage guns for professional use",
        imageUrl: "https://ext.same-assets.com/30303030/massage-gun-pro.jpg",
        showInNavigation: true
      },
      {
        id: "1-2",
        name: "Portable",
        slug: "portable",
        description: "Compact massage guns for travel and on-the-go recovery",
        imageUrl: "https://ext.same-assets.com/30303030/massage-gun-portable.jpg",
        showInNavigation: true
      }
    ]
  },
  {
    id: "2",
    name: "Foam Rollers",
    slug: "foam-rollers",
    description: "Self-myofascial release tools for recovery and flexibility",
    imageUrl: "https://ext.same-assets.com/30303031/foam-roller-category.jpg",
    showInNavigation: true,
    navigationOrder: 2,
    subcategories: [
      {
        id: "2-1",
        name: "Standard",
        slug: "standard",
        description: "Traditional foam rollers for general use",
        imageUrl: "https://ext.same-assets.com/30303031/foam-roller-standard.jpg",
        showInNavigation: true
      },
      {
        id: "2-2",
        name: "Textured",
        slug: "textured",
        description: "Textured foam rollers for deeper tissue massage",
        imageUrl: "https://ext.same-assets.com/30303031/foam-roller-textured.jpg",
        showInNavigation: true
      }
    ]
  },
  {
    id: "3",
    name: "Compression Devices",
    slug: "compression-devices",
    description: "Pneumatic compression systems for enhanced recovery",
    imageUrl: "https://ext.same-assets.com/30303032/compression-category.jpg",
    showInNavigation: true,
    navigationOrder: 3,
    subcategories: [
      {
        id: "3-1",
        name: "Leg Sleeves",
        slug: "leg-sleeves",
        description: "Compression sleeves for leg recovery",
        imageUrl: "https://ext.same-assets.com/30303032/compression-legs.jpg",
        showInNavigation: true
      },
      {
        id: "3-2",
        name: "Full Body Systems",
        slug: "full-body-systems",
        description: "Comprehensive compression systems for full-body recovery",
        imageUrl: "https://ext.same-assets.com/30303032/compression-full.jpg",
        showInNavigation: true
      }
    ]
  }
];

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
export const getNavigationCategories = async (): Promise<Category[]> => {
  try {
    const categories = await getCategoriesWithSubcategories();
    return categories.filter(cat => cat.showInNavigation !== false);
  } catch (error) {
    console.error("Error getting navigation categories:", error);
    return DEFAULT_CATEGORIES.filter(cat => cat.showInNavigation !== false);
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
      showInNavigation: (category as any).show_in_navigation,
      navigationOrder: (category as any).navigation_order,
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

/**
 * Create a new category
 */
export const createCategory = async (categoryData: CategoryInput): Promise<Category> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        image_url: categoryData.imageUrl,
        show_in_navigation: categoryData.showInNavigation,
        navigation_order: categoryData.navigationOrder
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating category:", error);
      throw new Error("Failed to create category");
    }
    
    const category = data as SupabaseCategory;
    
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
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
};

/**
 * Update an existing category
 */
export const updateCategory = async (categoryId: string, categoryData: Partial<CategoryInput>): Promise<Category> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        image_url: categoryData.imageUrl,
        show_in_navigation: categoryData.showInNavigation,
        navigation_order: categoryData.navigationOrder
      })
      .eq('id', categoryId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating category with ID ${categoryId}:`, error);
      throw new Error("Failed to update category");
    }
    
    const category = data as SupabaseCategory;
    
    // Get subcategories for this category
    const { data: subcategories, error: subError } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', categoryId);
    
    let mappedSubcategories: Subcategory[] = [];
    
    if (!subError && subcategories) {
      mappedSubcategories = (subcategories as SupabaseCategory[]).map(sub => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        imageUrl: sub.image_url,
        showInNavigation: sub.show_in_navigation
      }));
    }
    
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
    console.error(`Error updating category with ID ${categoryId}:`, error);
    throw new Error("Failed to update category");
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (categoryId: string): Promise<boolean> => {
  try {
    // First delete all subcategories
    const { error: subDeleteError } = await supabase
      .from('categories')
      .delete()
      .eq('parent_id', categoryId);
    
    if (subDeleteError) {
      console.error(`Error deleting subcategories for category ${categoryId}:`, subDeleteError);
      throw new Error("Failed to delete subcategories");
    }
    
    // Then delete the category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);
    
    if (error) {
      console.error(`Error deleting category with ID ${categoryId}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting category with ID ${categoryId}:`, error);
    throw new Error("Failed to delete category");
  }
};

/**
 * Create a new subcategory within a category
 */
export const createSubcategory = async (categoryId: string, subcategoryData: Omit<Subcategory, 'id'>): Promise<Subcategory> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: subcategoryData.name,
        slug: subcategoryData.slug,
        description: subcategoryData.description,
        image_url: subcategoryData.imageUrl,
        show_in_navigation: subcategoryData.showInNavigation,
        parent_id: categoryId
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Error creating subcategory for category ${categoryId}:`, error);
      throw new Error("Failed to create subcategory");
    }
    
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      imageUrl: data.image_url,
      showInNavigation: data.show_in_navigation
    };
  } catch (error) {
    console.error(`Error creating subcategory for category ${categoryId}:`, error);
    throw new Error("Failed to create subcategory");
  }
};

/**
 * Update an existing subcategory
 */
export const updateSubcategory = async (categoryId: string, subcategoryId: string, subcategoryData: Partial<Omit<Subcategory, 'id'>>): Promise<Subcategory> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: subcategoryData.name,
        slug: subcategoryData.slug,
        description: subcategoryData.description,
        image_url: subcategoryData.imageUrl,
        show_in_navigation: subcategoryData.showInNavigation
      })
      .eq('id', subcategoryId)
      .eq('parent_id', categoryId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating subcategory with ID ${subcategoryId}:`, error);
      throw new Error("Failed to update subcategory");
    }
    
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      imageUrl: data.image_url,
      showInNavigation: data.show_in_navigation
    };
  } catch (error) {
    console.error(`Error updating subcategory with ID ${subcategoryId}:`, error);
    throw new Error("Failed to update subcategory");
  }
};

/**
 * Delete a subcategory
 */
export const deleteSubcategory = async (categoryId: string, subcategoryId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', subcategoryId)
      .eq('parent_id', categoryId);
    
    if (error) {
      console.error(`Error deleting subcategory with ID ${subcategoryId}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting subcategory with ID ${subcategoryId}:`, error);
    throw new Error("Failed to delete subcategory");
  }
};
