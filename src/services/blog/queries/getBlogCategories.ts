
import { BlogCategory } from "../types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Get blog categories
 */
export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error retrieving blog categories from Supabase:", error);
      return [];
    }
    
    return data.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      created_at: category.created_at,
      updated_at: category.updated_at
    }));
  } catch (error) {
    console.error("Error retrieving blog categories:", error);
    return [];
  }
};
