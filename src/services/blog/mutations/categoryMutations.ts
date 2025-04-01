
import { BlogCategory } from "../types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Add a blog category
 */
export const addBlogCategory = async (category: Partial<BlogCategory>): Promise<BlogCategory> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        slug: category.slug,
        description: category.description
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding blog category:", error);
      throw new Error("Failed to add blog category");
    }
    
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Error adding blog category:", error);
    throw new Error("Failed to add blog category");
  }
};

/**
 * Update a blog category
 */
export const updateBlogCategory = async (id: string, category: Partial<BlogCategory>): Promise<BlogCategory> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: category.name,
        slug: category.slug,
        description: category.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating blog category:", error);
      throw new Error("Failed to update blog category");
    }
    
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Error updating blog category:", error);
    throw new Error("Failed to update blog category");
  }
};

/**
 * Delete a blog category
 */
export const deleteBlogCategory = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting blog category:", error);
      throw new Error("Failed to delete blog category");
    }
  } catch (error) {
    console.error("Error deleting blog category:", error);
    throw new Error("Failed to delete blog category");
  }
};
