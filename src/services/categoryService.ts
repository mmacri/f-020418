import { toast } from "@/hooks/use-toast";

// Type definitions
export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  subcategories: Subcategory[];
}

// Create types without id field
export type SubcategoryInput = {
  name: string;
  slug: string;
  description?: string;
};

export type CategoryInput = {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  subcategories: any[]; // Changed from Subcategory[] to any[] for more flexibility
  parentId?: number | null; // Added to match the form data
};

// Mock categories data
let CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Massage Guns",
    slug: "massage-guns",
    description: "Percussion therapy devices for muscle recovery and pain relief",
    imageUrl: "https://ext.same-assets.com/1001010126/massage-gun-category.jpg",
    subcategories: [
      {
        id: 1,
        name: "Percussion",
        slug: "percussion",
        description: "High-intensity percussion massage guns"
      },
      {
        id: 2,
        name: "Vibration",
        slug: "vibration",
        description: "Vibration-based massage devices"
      },
      {
        id: 3,
        name: "Heated",
        slug: "heated",
        description: "Massage guns with heat therapy"
      }
    ]
  },
  {
    id: 2,
    name: "Foam Rollers",
    slug: "foam-rollers",
    description: "Self-myofascial release tools for mobility and recovery",
    imageUrl: "https://ext.same-assets.com/30303031/foam-roller-category.jpg",
    subcategories: [
      {
        id: 4,
        name: "Standard",
        slug: "standard",
        description: "Basic foam rollers of varying densities"
      },
      {
        id: 5,
        name: "Textured",
        slug: "textured",
        description: "Foam rollers with textured surfaces for deeper massage"
      },
      {
        id: 6,
        name: "Vibrating",
        slug: "vibrating",
        description: "Foam rollers with vibration technology"
      }
    ]
  },
  {
    id: 3,
    name: "Compression Gear",
    slug: "compression-gear",
    description: "Garments and devices that apply pressure to enhance circulation and recovery",
    imageUrl: "https://ext.same-assets.com/30303032/compression-category.jpg",
    subcategories: [
      {
        id: 7,
        name: "Sleeves",
        slug: "sleeves",
        description: "Compression sleeves for arms and legs"
      },
      {
        id: 8,
        name: "Socks",
        slug: "socks",
        description: "Compression socks for foot and calf recovery"
      },
      {
        id: 9,
        name: "Full Body",
        slug: "full-body",
        description: "Full body compression suits and garments"
      }
    ]
  },
  {
    id: 4,
    name: "Resistance Bands",
    slug: "resistance-bands",
    description: "Elastic bands for strength training and mobility work",
    imageUrl: "https://ext.same-assets.com/30303033/bands-category.jpg",
    subcategories: [
      {
        id: 10,
        name: "Loop Bands",
        slug: "loop-bands",
        description: "Continuous loop resistance bands"
      },
      {
        id: 11,
        name: "Therapy Bands",
        slug: "therapy-bands",
        description: "Flat therapy bands for rehabilitation and mobility"
      },
      {
        id: 12,
        name: "Power Bands",
        slug: "power-bands",
        description: "Heavy duty bands for strength training"
      }
    ]
  }
];

// Store categories in localStorage on initialization
const initializeCategories = () => {
  const storedCategories = localStorage.getItem('categories');
  if (!storedCategories) {
    localStorage.setItem('categories', JSON.stringify(CATEGORIES));
  } else {
    CATEGORIES = JSON.parse(storedCategories);
  }
};

// Initialize on module load
initializeCategories();

// Get all categories for navigation
export const getNavigationCategories = async (): Promise<Category[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load latest from localStorage
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    CATEGORIES = JSON.parse(storedCategories);
  }
  
  return CATEGORIES;
};

// Get category by slug
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Load latest from localStorage
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    CATEGORIES = JSON.parse(storedCategories);
  }
  
  const category = CATEGORIES.find(c => c.slug === slug);
  return category || null;
};

// Get subcategory by slug
export const getSubcategoryBySlug = async (categorySlug: string, subcategorySlug: string): Promise<{category: Category, subcategory: Subcategory} | null> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Load latest from localStorage
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    CATEGORIES = JSON.parse(storedCategories);
  }
  
  const category = CATEGORIES.find(c => c.slug === categorySlug);
  if (!category) return null;
  
  const subcategory = category.subcategories.find(s => s.slug === subcategorySlug);
  if (!subcategory) return null;
  
  return { category, subcategory };
};

// Create new category
export const createCategory = async (category: CategoryInput): Promise<Category> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Load latest from localStorage
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    CATEGORIES = JSON.parse(storedCategories);
  }
  
  // Validate that slug doesn't already exist
  if (CATEGORIES.some(c => c.slug === category.slug)) {
    throw new Error(`Category with slug "${category.slug}" already exists`);
  }
  
  // Create new category with ID
  const newCategory: Category = {
    ...category,
    id: CATEGORIES.length > 0 ? Math.max(...CATEGORIES.map(c => c.id)) + 1 : 1,
    subcategories: category.subcategories || [],
  };
  
  // Add to categories and update localStorage
  CATEGORIES.push(newCategory);
  localStorage.setItem('categories', JSON.stringify(CATEGORIES));
  
  toast({
    title: "Category Created",
    description: `${newCategory.name} has been added successfully`
  });
  
  return newCategory;
};

// Update category
export const updateCategory = async (id: number, updates: CategoryInput): Promise<Category> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Load latest from localStorage
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    CATEGORIES = JSON.parse(storedCategories);
  }
  
  const index = CATEGORIES.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error(`Category with ID ${id} not found`);
  }
  
  // Validate that slug doesn't already exist (except for this category)
  if (CATEGORIES.some(c => c.slug === updates.slug && c.id !== id)) {
    throw new Error(`Category with slug "${updates.slug}" already exists`);
  }
  
  // Update the category but keep existing subcategories if not provided
  const existingSubcategories = CATEGORIES[index].subcategories;
  
  const updatedCategory: Category = {
    ...updates,
    id,
    subcategories: updates.subcategories || existingSubcategories || [],
  };
  
  CATEGORIES[index] = updatedCategory;
  localStorage.setItem('categories', JSON.stringify(CATEGORIES));
  
  toast({
    title: "Category Updated",
    description: `${updatedCategory.name} has been updated successfully`
  });
  
  return updatedCategory;
};

// Delete category
export const deleteCategory = async (id: number): Promise<boolean> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Load latest from localStorage
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    CATEGORIES = JSON.parse(storedCategories);
  }
  
  const index = CATEGORIES.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error(`Category with ID ${id} not found`);
  }
  
  const categoryName = CATEGORIES[index].name;
  CATEGORIES = CATEGORIES.filter(c => c.id !== id);
  localStorage.setItem('categories', JSON.stringify(CATEGORIES));
  
  toast({
    title: "Category Deleted",
    description: `${categoryName} has been deleted successfully`
  });
  
  return true;
};

// Create new subcategory
export const createSubcategory = async (categoryId: number, subcategory: SubcategoryInput): Promise<Subcategory> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Load latest from localStorage
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    CATEGORIES = JSON.parse(storedCategories);
  }
  
  const categoryIndex = CATEGORIES.findIndex(c => c.id === categoryId);
  if (categoryIndex === -1) {
    throw new Error(`Category with ID ${categoryId} not found`);
  }
  
  // Validate that slug doesn't already exist in this category
  if (CATEGORIES[categoryIndex].subcategories.some(s => s.slug === subcategory.slug)) {
    throw new Error(`Subcategory with slug "${subcategory.slug}" already exists in this category`);
  }
  
  // Create new subcategory with ID
  const newSubcategory: Subcategory = {
    ...subcategory,
    id: getNextSubcategoryId(),
  };
  
  // Add to subcategories and update localStorage
  CATEGORIES[categoryIndex].subcategories.push(newSubcategory);
  localStorage.setItem('categories', JSON.stringify(CATEGORIES));
  
  toast({
    title: "Subcategory Created",
    description: `${newSubcategory.name} has been added successfully`
  });
  
  return newSubcategory;
};

// Update subcategory
export const updateSubcategory = async (categoryId: number, subcategoryId: number, updates: SubcategoryInput): Promise<Subcategory> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Load latest from localStorage
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    CATEGORIES = JSON.parse(storedCategories);
  }
  
  const categoryIndex = CATEGORIES.findIndex(c => c.id === categoryId);
  if (categoryIndex === -1) {
    throw new Error(`Category with ID ${categoryId} not found`);
  }
  
  const subcategoryIndex = CATEGORIES[categoryIndex].subcategories.findIndex(s => s.id === subcategoryId);
  if (subcategoryIndex === -1) {
    throw new Error(`Subcategory with ID ${subcategoryId} not found in category ${categoryId}`);
  }
  
  // Validate that slug doesn't already exist in this category (except for this subcategory)
  if (CATEGORIES[categoryIndex].subcategories.some(s => s.slug === updates.slug && s.id !== subcategoryId)) {
    throw new Error(`Subcategory with slug "${updates.slug}" already exists in this category`);
  }
  
  // Update the subcategory
  const updatedSubcategory: Subcategory = {
    ...updates,
    id: subcategoryId,
  };
  
  CATEGORIES[categoryIndex].subcategories[subcategoryIndex] = updatedSubcategory;
  localStorage.setItem('categories', JSON.stringify(CATEGORIES));
  
  toast({
    title: "Subcategory Updated",
    description: `${updatedSubcategory.name} has been updated successfully`
  });
  
  return updatedSubcategory;
};

// Delete subcategory
export const deleteSubcategory = async (categoryId: number, subcategoryId: number): Promise<boolean> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Load latest from localStorage
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    CATEGORIES = JSON.parse(storedCategories);
  }
  
  const categoryIndex = CATEGORIES.findIndex(c => c.id === categoryId);
  if (categoryIndex === -1) {
    throw new Error(`Category with ID ${categoryId} not found`);
  }
  
  const subcategoryIndex = CATEGORIES[categoryIndex].subcategories.findIndex(s => s.id === subcategoryId);
  if (subcategoryIndex === -1) {
    throw new Error(`Subcategory with ID ${subcategoryId} not found in category ${categoryId}`);
  }
  
  const subcategoryName = CATEGORIES[categoryIndex].subcategories[subcategoryIndex].name;
  CATEGORIES[categoryIndex].subcategories = CATEGORIES[categoryIndex].subcategories.filter(s => s.id !== subcategoryId);
  localStorage.setItem('categories', JSON.stringify(CATEGORIES));
  
  toast({
    title: "Subcategory Deleted",
    description: `${subcategoryName} has been deleted successfully`
  });
  
  return true;
};

// Helper function to get next subcategory ID
const getNextSubcategoryId = (): number => {
  // Find the largest existing subcategory ID across all categories
  let maxId = 0;
  CATEGORIES.forEach(category => {
    category.subcategories.forEach(subcategory => {
      if (subcategory.id > maxId) {
        maxId = subcategory.id;
      }
    });
  });
  return maxId + 1;
};
