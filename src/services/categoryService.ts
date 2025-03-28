
import { toast } from "@/hooks/use-toast";

// Category type definitions
export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  heroImage?: string;
  subcategories: Subcategory[];
  showInNavigation: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Mock category data
let CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Massage Guns",
    slug: "massage-guns",
    description: "Discover the best percussion massage guns for recovery, pain relief, and muscle relaxation.",
    imageUrl: "https://ext.same-assets.com/30303030/massage-gun-category.jpg",
    heroImage: "https://ext.same-assets.com/30303035/massage-gun-hero.jpg",
    subcategories: [
      {
        id: 1,
        name: "Percussion",
        slug: "percussion",
        description: "Powerful percussion massage guns for deep tissue relief",
        order: 1
      },
      {
        id: 2,
        name: "Vibration",
        slug: "vibration",
        description: "Vibration therapy massage guns for gentle muscle relaxation",
        order: 2
      },
      {
        id: 3,
        name: "Heated",
        slug: "heated",
        description: "Heated massage guns that combine thermal therapy with percussion",
        order: 3
      }
    ],
    showInNavigation: true,
    order: 1,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Foam Rollers",
    slug: "foam-rollers",
    description: "Explore our selection of foam rollers for myofascial release, improved flexibility, and muscle recovery.",
    imageUrl: "https://ext.same-assets.com/30303031/foam-roller-category.jpg",
    heroImage: "https://ext.same-assets.com/30303036/foam-roller-hero.jpg",
    subcategories: [
      {
        id: 4,
        name: "Standard",
        slug: "standard",
        description: "Classic foam rollers for general myofascial release",
        order: 1
      },
      {
        id: 5,
        name: "Textured",
        slug: "textured",
        description: "Textured foam rollers for targeted pressure point relief",
        order: 2
      },
      {
        id: 6,
        name: "Vibrating",
        slug: "vibrating",
        description: "Vibrating foam rollers that combine pressure with vibration therapy",
        order: 3
      }
    ],
    showInNavigation: true,
    order: 2,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Fitness Bands",
    slug: "fitness-bands",
    description: "Find the perfect resistance bands for strength training, physical therapy, and mobility work.",
    imageUrl: "https://ext.same-assets.com/30303032/fitness-bands-category.jpg",
    heroImage: "https://ext.same-assets.com/30303037/fitness-bands-hero.jpg",
    subcategories: [
      {
        id: 7,
        name: "Resistance Loops",
        slug: "resistance-loops",
        description: "Small loop bands for targeted muscle activation",
        order: 1
      },
      {
        id: 8,
        name: "Pull-up Bands",
        slug: "pull-up-bands",
        description: "Long, heavy-duty bands for assisted pull-ups and strength training",
        order: 2
      },
      {
        id: 9,
        name: "Therapy Bands",
        slug: "therapy-bands",
        description: "Flat bands for rehabilitation and physical therapy",
        order: 3
      }
    ],
    showInNavigation: true,
    order: 3,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Compression Gear",
    slug: "compression-gear",
    description: "Browse our selection of compression clothing and accessories for improved circulation and recovery.",
    imageUrl: "https://ext.same-assets.com/30303033/compression-gear-category.jpg",
    heroImage: "https://ext.same-assets.com/30303038/compression-gear-hero.jpg",
    subcategories: [
      {
        id: 10,
        name: "Sleeves",
        slug: "sleeves",
        description: "Compression sleeves for targeted limb support",
        order: 1
      },
      {
        id: 11,
        name: "Socks",
        slug: "socks",
        description: "Compression socks for improved circulation and recovery",
        order: 2
      },
      {
        id: 12,
        name: "Full Body",
        slug: "full-body",
        description: "Full body compression garments for total recovery",
        order: 3
      }
    ],
    showInNavigation: true,
    order: 4,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  }
];

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...CATEGORIES];
};

// Get navigation categories (those marked to show in navigation)
export const getNavigationCategories = async (): Promise<Category[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...CATEGORIES].filter(c => c.showInNavigation).sort((a, b) => a.order - b.order);
};

// Get category by ID
export const getCategoryById = async (id: number): Promise<Category | null> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 200));
  const category = CATEGORIES.find(c => c.id === id);
  return category || null;
};

// Get category by slug
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 200));
  const category = CATEGORIES.find(c => c.slug === slug);
  return category || null;
};

// Get subcategory by slug
export const getSubcategoryBySlug = async (categorySlug: string, subcategorySlug: string): Promise<Subcategory | null> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const category = CATEGORIES.find(c => c.slug === categorySlug);
  if (!category) return null;
  
  const subcategory = category.subcategories.find(s => s.slug === subcategorySlug);
  return subcategory || null;
};

// Create new category
export const createCategory = async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Create new category with ID and dates
  const newCategory: Category = {
    ...category,
    id: Math.max(...CATEGORIES.map(c => c.id)) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  CATEGORIES.push(newCategory);
  
  toast({
    title: "Category created",
    description: `"${newCategory.name}" has been added successfully`
  });
  
  return newCategory;
};

// Update category
export const updateCategory = async (id: number, updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const index = CATEGORIES.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error(`Category with ID ${id} not found`);
  }
  
  // Update the category
  const updatedCategory: Category = {
    ...CATEGORIES[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  CATEGORIES[index] = updatedCategory;
  
  toast({
    title: "Category updated",
    description: `"${updatedCategory.name}" has been updated successfully`
  });
  
  return updatedCategory;
};

// Delete category
export const deleteCategory = async (id: number): Promise<boolean> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = CATEGORIES.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error(`Category with ID ${id} not found`);
  }
  
  const categoryName = CATEGORIES[index].name;
  CATEGORIES = CATEGORIES.filter(c => c.id !== id);
  
  toast({
    title: "Category deleted",
    description: `"${categoryName}" has been removed successfully`
  });
  
  return true;
};

// Add subcategory to category
export const addSubcategory = async (categoryId: number, subcategory: Omit<Subcategory, 'id'>): Promise<Subcategory> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const categoryIndex = CATEGORIES.findIndex(c => c.id === categoryId);
  if (categoryIndex === -1) {
    throw new Error(`Category with ID ${categoryId} not found`);
  }
  
  // Create new subcategory with ID
  const newSubcategory: Subcategory = {
    ...subcategory,
    id: Math.max(0, ...CATEGORIES[categoryIndex].subcategories.map(s => s.id)) + 1
  };
  
  CATEGORIES[categoryIndex].subcategories.push(newSubcategory);
  CATEGORIES[categoryIndex].updatedAt = new Date().toISOString();
  
  toast({
    title: "Subcategory added",
    description: `"${newSubcategory.name}" has been added to ${CATEGORIES[categoryIndex].name}`
  });
  
  return newSubcategory;
};

// Remove subcategory from category
export const removeSubcategory = async (categoryId: number, subcategoryId: number): Promise<boolean> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const categoryIndex = CATEGORIES.findIndex(c => c.id === categoryId);
  if (categoryIndex === -1) {
    throw new Error(`Category with ID ${categoryId} not found`);
  }
  
  const subcategory = CATEGORIES[categoryIndex].subcategories.find(s => s.id === subcategoryId);
  if (!subcategory) {
    throw new Error(`Subcategory with ID ${subcategoryId} not found in category ${categoryId}`);
  }
  
  const subcategoryName = subcategory.name;
  CATEGORIES[categoryIndex].subcategories = CATEGORIES[categoryIndex].subcategories.filter(s => s.id !== subcategoryId);
  CATEGORIES[categoryIndex].updatedAt = new Date().toISOString();
  
  toast({
    title: "Subcategory removed",
    description: `"${subcategoryName}" has been removed from ${CATEGORIES[categoryIndex].name}`
  });
  
  return true;
};
