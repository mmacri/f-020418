
import { localStorageKeys } from "@/lib/constants";

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  categoryId: number;
  rating: number;
  reviewCount: number;
  features?: string[];
  affiliateLink?: string;
  brand?: string;
  specifications?: { [key: string]: string };
  availability?: string;
  createdAt: string;
  updatedAt: string;
}

// Get products from localStorage
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsData = localStorage.getItem(localStorageKeys.PRODUCTS);
    return productsData ? JSON.parse(productsData) : [];
  } catch (error) {
    console.error("Error retrieving products:", error);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const products = await getProducts();
    return products.find(product => product.id === id) || null;
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
    
    return newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to add product");
  }
};

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
    
    return updatedProduct;
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
