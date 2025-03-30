
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
    // Try to get categories from Supabase
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error getting categories from Supabase:", error);
      // Fall back to localStorage
      const cachedData = localStorage.getItem(localStorageKeys.CATEGORIES);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        // If data exists and is an array, return it
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          return parsedData;
        }
      }
      
      // If no valid data was found in storage or Supabase, store the default categories and return them
      localStorage.setItem(localStorageKeys.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    
    // Process categories to get subcategories
    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        // For now, we're using parent_id to identify subcategories
        // A future improvement would be to create a separate subcategories table
        const { data: subcategories, error: subError } = await supabase
          .from('categories')
          .select('*')
          .eq('parent_id', category.id)
          .order('name');
        
        if (subError) {
          console.error(`Error getting subcategories for ${category.name}:`, subError);
          return {
            ...category,
            subcategories: []
          };
        }
        
        // Map to our Subcategory interface
        const mappedSubcategories = subcategories.map(sub => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          imageUrl: sub.image_url,
          showInNavigation: true // Default to true
        }));
        
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          imageUrl: category.image_url,
          showInNavigation: true, // Default to true
          navigationOrder: 0, // Default order
          subcategories: mappedSubcategories
        };
      })
    );
    
    // Cache in localStorage for future use
    localStorage.setItem(localStorageKeys.CATEGORIES, JSON.stringify(categoriesWithSubcategories));
    return categoriesWithSubcategories;
  } catch (error) {
    console.error("Error getting categories:", error);
    // In case of error, still return default categories
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
    // Return filtered default categories on error
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
      .eq('parent_id', null) // Ensure it's a parent category, not a subcategory
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
    const mappedSubcategories = subcategories.map(sub => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      description: sub.description,
      imageUrl: sub.image_url,
      showInNavigation: true // Default to true
    }));
    
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.image_url,
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
    const categories = await getCategoriesWithSubcategories();
    
    const newCategory: Category = {
      id: Date.now().toString(),
      ...categoryData,
      subcategories: []
    };
    
    const updatedCategories = [...categories, newCategory];
    localStorage.setItem(localStorageKeys.CATEGORIES, JSON.stringify(updatedCategories));
    
    return newCategory;
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
    const categories = await getCategoriesWithSubcategories();
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }
    
    const updatedCategory = {
      ...categories[categoryIndex],
      ...categoryData
    };
    
    categories[categoryIndex] = updatedCategory;
    localStorage.setItem(localStorageKeys.CATEGORIES, JSON.stringify(categories));
    
    return updatedCategory;
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
    const categories = await getCategoriesWithSubcategories();
    const filteredCategories = categories.filter(cat => cat.id !== categoryId);
    
    if (filteredCategories.length === categories.length) {
      return false; // No category was removed
    }
    
    localStorage.setItem(localStorageKeys.CATEGORIES, JSON.stringify(filteredCategories));
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
    const categories = await getCategoriesWithSubcategories();
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }
    
    const newSubcategory: Subcategory = {
      id: `${categoryId}-${Date.now()}`,
      ...subcategoryData
    };
    
    if (!categories[categoryIndex].subcategories) {
      categories[categoryIndex].subcategories = [];
    }
    
    categories[categoryIndex].subcategories!.push(newSubcategory);
    localStorage.setItem(localStorageKeys.CATEGORIES, JSON.stringify(categories));
    
    return newSubcategory;
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
    const categories = await getCategoriesWithSubcategories();
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1 || !categories[categoryIndex].subcategories) {
      throw new Error("Category or subcategories not found");
    }
    
    const subcategoryIndex = categories[categoryIndex].subcategories!.findIndex(sub => sub.id === subcategoryId);
    
    if (subcategoryIndex === -1) {
      throw new Error("Subcategory not found");
    }
    
    const updatedSubcategory = {
      ...categories[categoryIndex].subcategories![subcategoryIndex],
      ...subcategoryData
    };
    
    categories[categoryIndex].subcategories![subcategoryIndex] = updatedSubcategory;
    localStorage.setItem(localStorageKeys.CATEGORIES, JSON.stringify(categories));
    
    return updatedSubcategory;
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
    const categories = await getCategoriesWithSubcategories();
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1 || !categories[categoryIndex].subcategories) {
      return false;
    }
    
    const originalLength = categories[categoryIndex].subcategories!.length;
    categories[categoryIndex].subcategories = categories[categoryIndex].subcategories!.filter(sub => sub.id !== subcategoryId);
    
    if (categories[categoryIndex].subcategories!.length === originalLength) {
      return false; // No subcategory was removed
    }
    
    localStorage.setItem(localStorageKeys.CATEGORIES, JSON.stringify(categories));
    return true;
  } catch (error) {
    console.error(`Error deleting subcategory with ID ${subcategoryId}:`, error);
    throw new Error("Failed to delete subcategory");
  }
};
