import { getCategoryBySlug } from '@/services/categoryService';
import { getProducts, getProductById, getProductBySlug } from '@/services/productService';
import { currencyFormatter } from './constants';

/**
 * Get category name from slug
 */
export const getCategoryName = (categorySlug: string): string => {
  // Convert slug to display name
  return categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get products by category slug with enhanced subcategory support
 */
export const getProductsByCategory = async (categorySlug: string, subcategorySlug?: string): Promise<any[]> => {
  try {
    // Get all products
    const allProducts = await getProducts();
    
    // Get category data to match by ID
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return [];
    
    // Filter by category
    let products = allProducts.filter(product => {
      // Match by category ID (convert to string for comparison)
      if (String(product.categoryId) === String(category.id)) {
        return true;
      }
      
      // Match by category name/slug as fallback
      if (product.category && 
          (product.category.toLowerCase() === category.name.toLowerCase() || 
           product.category.toLowerCase().replace(/\s+/g, '-') === categorySlug)) {
        return true;
      }
      
      return false;
    });
    
    // If subcategory is specified, filter further
    if (subcategorySlug && products.length > 0) {
      // Find the subcategory in the category
      const subcategory = category.subcategories?.find(sub => sub.slug === subcategorySlug);
      
      if (subcategory) {
        products = products.filter(product => {
          // Match by subcategory
          if (product.subcategory && 
              (product.subcategory.toLowerCase() === subcategory.name.toLowerCase() || 
               product.subcategory.toLowerCase().replace(/\s+/g, '-') === subcategorySlug)) {
            return true;
          }
          
          // Match by subcategoryId if available
          if (product.subcategoryId && String(product.subcategoryId) === String(subcategory.id)) {
            return true;
          }
          
          return false;
        });
      }
    }
    
    return products;
  } catch (error) {
    console.error('Error getting products by category:', error);
    return [];
  }
};

/**
 * Format currency - Keeping for backward compatibility
 */
export const formatCurrency = (amount: number): string => {
  return currencyFormatter.format(amount);
};

/**
 * Format price - Alias for formatCurrency for better semantics
 */
export const formatPrice = formatCurrency;

/**
 * Calculate discount percentage
 */
export const calculateDiscountPercentage = (price: number, comparePrice?: number): number | null => {
  if (!comparePrice || comparePrice <= price) return null;
  
  const discount = ((comparePrice - price) / comparePrice) * 100;
  return Math.round(discount);
};

/**
 * Get a summary of product features
 */
export const getProductFeatureSummary = (product: any, maxFeatures: number = 3): string[] => {
  if (!product) return [];
  
  const features = [];
  
  // If product has explicit features array, use that
  if (product.features && Array.isArray(product.features)) {
    return product.features.slice(0, maxFeatures);
  }
  
  // Otherwise, extract from specifications if available
  if (product.specifications && typeof product.specifications === 'object') {
    const specs = Object.entries(product.specifications)
      .map(([key, value]) => `${key}: ${value}`)
      .slice(0, maxFeatures);
    
    return specs;
  }
  
  // If no features or specs, return empty array
  return [];
};

/**
 * Get related products (similar products in the same category or subcategory)
 * Enhanced to better support subcategories
 */
export const getRelatedProducts = async (productId: number, limit: number = 4): Promise<any[]> => {
  try {
    const product = await getProductById(productId);
    if (!product) return [];
    
    const allProducts = await getProducts();
    
    // Get products in the same category, excluding the current product
    const categoryProducts = allProducts.filter(p => 
      p.categoryId === product.categoryId && p.id !== product.id
    );
    
    // Prioritize products in the same subcategory if available
    let sortedProducts = [...categoryProducts];
    
    if (product.subcategory || product.subcategoryId) {
      sortedProducts.sort((a, b) => {
        // Sort by subcategory match
        const aMatches = (a.subcategory === product.subcategory) || 
                         (a.subcategoryId && product.subcategoryId && 
                          String(a.subcategoryId) === String(product.subcategoryId));
        
        const bMatches = (b.subcategory === product.subcategory) || 
                         (b.subcategoryId && product.subcategoryId && 
                          String(b.subcategoryId) === String(product.subcategoryId));
        
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        
        // Then by rating (highest first)
        return b.rating - a.rating;
      });
    } else {
      // If no subcategory, just sort by rating
      sortedProducts.sort((a, b) => b.rating - a.rating);
    }
    
    // Limit results
    return sortedProducts.slice(0, limit);
  } catch (error) {
    console.error('Error getting related products:', error);
    return [];
  }
};

/**
 * Generate product link
 */
export const getProductLink = (product: any): string => {
  if (!product) return '#';
  
  // If product has a slug, use that for the URL
  if (product.slug) {
    return `/products/${product.slug}`;
  }
  
  // If no slug, use ID
  return `/products/${product.id}`;
};

/**
 * Generate product URL - Alias for getProductLink for better semantics
 */
export const getProductUrl = getProductLink;

/**
 * Get first product image or fallback
 */
export const getProductImage = (product: any, fallbackUrl: string = '/placeholder.svg'): string => {
  if (!product) return fallbackUrl;
  
  // If product has images array, return the first image
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }
  
  // If product has imageUrl, return that
  if (product.imageUrl) {
    return product.imageUrl;
  }
  
  // Return fallback image
  return fallbackUrl;
};

/**
 * Get product images array
 */
export const getProductImages = (product: any): string[] => {
  if (!product) return [];
  
  // If product has images array, return that
  if (product.images && Array.isArray(product.images)) {
    return product.images;
  }
  
  // If product has imageUrl and additionalImages, combine them
  if (product.imageUrl) {
    const images = [product.imageUrl];
    
    if (product.additionalImages && Array.isArray(product.additionalImages)) {
      images.push(...product.additionalImages);
    }
    
    return images;
  }
  
  return [];
};

/**
 * Get product image URL (with fallback and processing)
 */
export const getProductImageUrl = (
  product: any, 
  index: number = 0, 
  fallbackUrl: string = '/placeholder.svg',
  size: 'small' | 'medium' | 'large' | 'original' = 'medium'
): string => {
  // Get product images
  const images = getProductImages(product);
  
  // If no images or invalid index, return fallback
  if (images.length === 0 || index < 0 || index >= images.length) {
    return fallbackUrl;
  }
  
  const imageUrl = images[index];
  
  // For now, just return the image URL directly
  // In a real app, you might process the URL based on the size parameter
  return imageUrl;
};

/**
 * Create a product image URL with cache busting
 */
export const createProductImageUrl = (url: string, addCacheBusting: boolean = false): string => {
  if (!url) return '/placeholder.svg';
  
  // Don't add cache busting for local images or data URLs
  if (!addCacheBusting || url.startsWith('/') || url.startsWith('data:')) {
    return url;
  }
  
  // Add timestamp as cache buster
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

/**
 * Get product subcategory information
 */
export const getProductSubcategory = async (product: any) => {
  if (!product || (!product.subcategory && !product.subcategoryId)) {
    return null;
  }
  
  try {
    // If we have a category, find the subcategory within it
    if (product.categoryId) {
      const category = await getCategoryBySlug(product.category?.toLowerCase().replace(/\s+/g, '-'));
      
      if (category && category.subcategories) {
        // Try to match by ID first
        if (product.subcategoryId) {
          const subById = category.subcategories.find(
            s => String(s.id) === String(product.subcategoryId)
          );
          if (subById) return subById;
        }
        
        // Then try to match by name
        if (product.subcategory) {
          const subByName = category.subcategories.find(
            s => s.name.toLowerCase() === product.subcategory.toLowerCase() ||
                 s.slug === product.subcategory.toLowerCase().replace(/\s+/g, '-')
          );
          if (subByName) return subByName;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting product subcategory:', error);
    return null;
  }
};

/**
 * Generate product breadcrumbs including subcategory
 */
export const getProductBreadcrumbs = async (product: any) => {
  const breadcrumbs = [
    { name: 'Home', href: '/' }
  ];
  
  try {
    if (product.categoryId || product.category) {
      let categorySlug = '';
      let categoryName = '';
      
      if (product.category) {
        categorySlug = product.category.toLowerCase().replace(/\s+/g, '-');
        categoryName = product.category;
      }
      
      // Add category breadcrumb
      breadcrumbs.push({
        name: categoryName,
        href: `/categories/${categorySlug}`
      });
      
      // Add subcategory breadcrumb if exists
      const subcategory = await getProductSubcategory(product);
      if (subcategory) {
        breadcrumbs.push({
          name: subcategory.name,
          href: `/categories/${categorySlug}/${subcategory.slug}`
        });
      }
    }
    
    // Add product breadcrumb
    breadcrumbs.push({
      name: product.name,
      href: `/products/${product.slug || product.id}`
    });
    
    return breadcrumbs;
  } catch (error) {
    console.error('Error generating product breadcrumbs:', error);
    
    // Fallback simple breadcrumbs
    return [
      { name: 'Home', href: '/' },
      { name: 'Products', href: '/products' },
      { name: product.name, href: `/products/${product.slug || product.id}` }
    ];
  }
};
