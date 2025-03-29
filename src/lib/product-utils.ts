
import { getProducts, Product } from "@/services/productService";
import { getCategoryBySlug } from "@/services/categoryService";

/**
 * Get products by category slug
 */
export const getProductsByCategory = async (categorySlug: string, subcategorySlug?: string): Promise<Product[]> => {
  try {
    // Get all products
    const products = await getProducts();
    
    // Get category for ID lookup
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return [];
    
    // Filter products by category ID
    let filteredProducts = products.filter(product => product.categoryId === category.id);
    
    // Further filter by subcategory if provided
    if (subcategorySlug && filteredProducts.length > 0) {
      // Find the subcategory in the category
      const subcategory = category.subcategories.find(sub => sub.slug === subcategorySlug);
      if (subcategory) {
        filteredProducts = filteredProducts.filter(product => {
          // Match either by subcategory name or slug
          if (product.subcategory) {
            return (
              product.subcategory === subcategory.name || 
              product.subcategory === subcategory.slug ||
              product.subcategory.toLowerCase() === subcategory.name.toLowerCase()
            );
          }
          return false;
        });
      }
    }
    
    return filteredProducts;
  } catch (error) {
    console.error("Error getting products by category:", error);
    return [];
  }
};

/**
 * Format product price with currency symbol
 */
export const formatPrice = (price: number, currency: string = "$"): string => {
  return `${currency}${price.toFixed(2)}`;
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  if (!originalPrice || originalPrice <= 0 || !currentPrice || currentPrice <= 0) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * Sort products by specific criteria
 */
export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const productsCopy = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return productsCopy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return productsCopy.sort((a, b) => b.price - a.price);
    case 'rating':
      return productsCopy.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return productsCopy.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    default:
      return productsCopy;
  }
};

/**
 * Filter products by attributes
 */
export const filterProducts = (
  products: Product[], 
  filters: { 
    minPrice?: number; 
    maxPrice?: number; 
    minRating?: number;
    brands?: string[];
  }
): Product[] => {
  return products.filter(product => {
    // Price filter
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;
    
    // Rating filter
    if (filters.minRating && product.rating < filters.minRating) return false;
    
    // Brand filter
    if (filters.brands && filters.brands.length > 0 && product.brand) {
      if (!filters.brands.includes(product.brand)) return false;
    }
    
    return true;
  });
};

/**
 * Generate a product URL
 */
export const getProductUrl = (product: Product): string => {
  return `/products/${product.slug}`;
};

/**
 * Compare two products and find their differences
 */
export const compareProducts = (productA: Product, productB: Product): Record<string, any> => {
  const comparison: Record<string, any> = {};
  
  // Compare basic properties
  comparison.price = {
    a: productA.price,
    b: productB.price,
    difference: productA.price - productB.price
  };
  
  comparison.rating = {
    a: productA.rating,
    b: productB.rating,
    difference: productA.rating - productB.rating
  };
  
  // Compare specifications
  if (productA.specifications && productB.specifications) {
    comparison.specs = {};
    
    // Get all unique specification keys
    const allSpecKeys = new Set([
      ...Object.keys(productA.specifications),
      ...Object.keys(productB.specifications)
    ]);
    
    // Compare each specification
    allSpecKeys.forEach(key => {
      comparison.specs[key] = {
        a: productA.specifications?.[key] || 'N/A',
        b: productB.specifications?.[key] || 'N/A',
        different: productA.specifications?.[key] !== productB.specifications?.[key]
      };
    });
  }
  
  return comparison;
};

/**
 * Get related products (from same category)
 */
export const getRelatedProducts = async (product: Product, limit: number = 3): Promise<Product[]> => {
  try {
    if (!product.categoryId) return [];
    
    const allProducts = await getProducts();
    return allProducts
      .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting related products:", error);
    return [];
  }
};

/**
 * Get "best of" products by category
 */
export const getBestProductsByCategory = async (categorySlug: string, limit: number = 5): Promise<Product[]> => {
  try {
    const products = await getProductsByCategory(categorySlug);
    return [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting best products:", error);
    return [];
  }
};

/**
 * Get category name from slug
 */
export const getCategoryName = (categorySlug: string): string => {
  // Convert slug to readable name (e.g., "massage-guns" to "Massage Guns")
  return categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

