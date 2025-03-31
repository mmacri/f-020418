
import { supabase } from '@/integrations/supabase/client';
import { Category, CategoryInput, Subcategory, SupabaseCategory } from './types';

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
