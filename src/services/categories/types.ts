
// Type definitions for category-related data

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
export interface SupabaseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  show_in_navigation?: boolean;
  navigation_order?: number;
}
