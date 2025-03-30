// Add this function to the existing categoryService.ts file
export const getCategoriesWithSubcategories = async () => {
  // This is a mock implementation - in a real app, you would fetch from an API
  return [
    {
      id: "1",
      name: "Recovery Software",
      slug: "recovery-software",
      description: "All kinds of data recovery software for different platforms",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      showInNavigation: true,
      navigationOrder: 1,
      subcategories: [
        {
          id: "1-1",
          name: "Windows Recovery",
          slug: "windows-recovery",
          description: "Data recovery software for Windows",
          imageUrl: "https://images.unsplash.com/photo-1624571591189-c3ce5b2c5aff",
          showInNavigation: true
        },
        {
          id: "1-2",
          name: "Mac Recovery",
          slug: "mac-recovery",
          description: "Data recovery software for Mac",
          imageUrl: "https://images.unsplash.com/photo-1614633833026-0820961292d8",
          showInNavigation: true
        }
      ]
    },
    {
      id: "2",
      name: "Backup Solutions",
      slug: "backup-solutions",
      description: "Backup software and hardware for data protection",
      imageUrl: "https://images.unsplash.com/photo-1563986768711-b3bde3dc821e",
      showInNavigation: true,
      navigationOrder: 2,
      subcategories: []
    },
    {
      id: "3",
      name: "Security Tools",
      slug: "security-tools",
      description: "Tools to secure your data and devices",
      imageUrl: "https://images.unsplash.com/photo-1563206767-5b18f218e8de",
      showInNavigation: false,
      subcategories: [
        {
          id: "3-1",
          name: "Antivirus",
          slug: "antivirus",
          description: "Protection against malware",
          imageUrl: "https://images.unsplash.com/photo-1573164574397-dd250bc8a598",
          showInNavigation: true
        }
      ]
    }
  ];
};

export const createCategory = async (categoryData) => {
  // Mock implementation
  console.log('Creating category:', categoryData);
  return {
    id: Date.now().toString(),
    ...categoryData
  };
};

export const updateCategory = async (categoryId, categoryData) => {
  // Mock implementation
  console.log(`Updating category ${categoryId}:`, categoryData);
  return {
    id: categoryId,
    ...categoryData
  };
};

export const deleteCategory = async (categoryId) => {
  // Mock implementation
  console.log(`Deleting category ${categoryId}`);
  return true;
};

export const createSubcategory = async (categoryId, subcategoryData) => {
  // Mock implementation
  console.log(`Creating subcategory for category ${categoryId}:`, subcategoryData);
  return {
    id: `${categoryId}-${Date.now()}`,
    ...subcategoryData
  };
};

export const updateSubcategory = async (categoryId, subcategoryId, subcategoryData) => {
  // Mock implementation
  console.log(`Updating subcategory ${subcategoryId} for category ${categoryId}:`, subcategoryData);
  return {
    id: subcategoryId,
    ...subcategoryData
  };
};

export const deleteSubcategory = async (categoryId, subcategoryId) => {
  // Mock implementation
  console.log(`Deleting subcategory ${subcategoryId} from category ${categoryId}`);
  return true;
};

// Add these missing functions that are being imported throughout the app

// Type definitions to fix TypeScript errors
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

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  showInNavigation?: boolean;
}

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  showInNavigation?: boolean;
  navigationOrder?: number;
}

// Function to get categories that should be shown in navigation
export const getNavigationCategories = async (): Promise<Category[]> => {
  const allCategories = await getCategoriesWithSubcategories();
  // You could filter these based on showInNavigation property, but for now just return all
  return allCategories;
};

// Get a category by its slug
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const allCategories = await getCategoriesWithSubcategories();
  return allCategories.find(cat => cat.slug === slug) || null;
};

// Get a subcategory by its slug within a category
export const getSubcategoryBySlug = async (categorySlug: string, subcategorySlug: string): Promise<{ category: Category, subcategory: Subcategory } | null> => {
  const category = await getCategoryBySlug(categorySlug);
  if (!category || !category.subcategories) return null;
  
  const subcategory = category.subcategories.find(sub => sub.slug === subcategorySlug);
  if (!subcategory) return null;
  
  return { category, subcategory };
};

// Get all categories and their subcategories
export const getAllCategories = async (): Promise<Category[]> => {
  return getCategoriesWithSubcategories();
};

// Get a category by its ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  const allCategories = await getCategoriesWithSubcategories();
  return allCategories.find(cat => cat.id === id) || null;
};
