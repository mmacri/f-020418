
import { localStorageKeys } from "@/lib/constants";

export interface Product {
  id: number;
  name: string;
  title?: string; // Add title as an alias for name
  slug: string;
  description: string;
  shortDescription?: string; // Add shortDescription property
  price: number;
  comparePrice?: number;
  originalPrice?: number; // Add originalPrice property
  images: string[];
  imageUrl?: string; // Add imageUrl property
  additionalImages?: string[]; // Add additionalImages property
  category: string;
  categoryId: number;
  subcategory?: string; // Add subcategory property
  rating: number;
  reviewCount: number;
  features?: string[];
  affiliateLink?: string;
  affiliateUrl?: string; // Add affiliateUrl as alias for affiliateLink
  brand?: string;
  specifications?: { [key: string]: string };
  availability?: string;
  inStock?: boolean; // Add inStock property
  bestSeller?: boolean; // Add bestSeller property
  asin?: string; // Add ASIN property
  createdAt: string;
  updatedAt: string;
}

// Backward compatibility getter function
const getProductWithBackwardsCompatibility = (product: Product): Product => {
  return {
    ...product,
    title: product.name, // Alias name as title
    imageUrl: product.images[0], // Use first image as imageUrl
    additionalImages: product.images.slice(1), // Use remaining images as additionalImages
    originalPrice: product.comparePrice, // Alias comparePrice as originalPrice
    affiliateUrl: product.affiliateLink, // Alias affiliateLink as affiliateUrl
    inStock: product.availability === "In Stock" || !product.availability, // Set inStock based on availability
  };
};

// Get products from localStorage
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsData = localStorage.getItem(localStorageKeys.PRODUCTS);
    const products = productsData ? JSON.parse(productsData) : [];
    // Add backwards compatibility properties to each product
    return products.map(getProductWithBackwardsCompatibility);
  } catch (error) {
    console.error("Error retrieving products:", error);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const products = await getProducts();
    const product = products.find(product => product.id === id) || null;
    return product;
  } catch (error) {
    console.error(`Error retrieving product with ID ${id}:`, error);
    return null;
  }
};

// Get product by slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const products = await getProducts();
    return products.find(product => product.slug === slug) || null;
  } catch (error) {
    console.error(`Error retrieving product with slug ${slug}:`, error);
    return null;
  }
};

// Get products by category
export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const products = await getProducts();
    return products.filter(product => product.categoryId === categoryId);
  } catch (error) {
    console.error(`Error retrieving products for category ${categoryId}:`, error);
    return [];
  }
};

// Add product
export const addProduct = async (product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> => {
  try {
    const products = await getProducts();
    const newProduct: Product = {
      ...product,
      id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(
      localStorageKeys.PRODUCTS,
      JSON.stringify([...products, newProduct])
    );
    
    return getProductWithBackwardsCompatibility(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to add product");
  }
};

// Alias for addProduct to match expected function name
export const createProduct = addProduct;

// Update product
export const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product | null> => {
  try {
    const products = await getProducts();
    const productIndex = products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      return null;
    }
    
    const updatedProduct = {
      ...products[productIndex],
      ...productData,
      updatedAt: new Date().toISOString()
    };
    
    products[productIndex] = updatedProduct;
    localStorage.setItem(localStorageKeys.PRODUCTS, JSON.stringify(products));
    
    return getProductWithBackwardsCompatibility(updatedProduct);
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw new Error("Failed to update product");
  }
};

// Delete product
export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    const products = await getProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    
    if (filteredProducts.length === products.length) {
      return false;
    }
    
    localStorage.setItem(localStorageKeys.PRODUCTS, JSON.stringify(filteredProducts));
    return true;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw new Error("Failed to delete product");
  }
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const products = await getProducts();
    const searchTerm = query.toLowerCase().trim();
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      (product.brand && product.brand.toLowerCase().includes(searchTerm))
    );
  } catch (error) {
    console.error(`Error searching products for "${query}":`, error);
    return [];
  }
};
