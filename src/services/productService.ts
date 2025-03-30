
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
  subcategoryId?: number; // Add subcategoryId property
  rating: number;
  reviewCount: number;
  features?: string[];
  pros?: string[]; // Add pros property for comparison tables
  cons?: string[]; // Also add cons for completeness
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

// Default products to use when none exist
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "TheraGun Pro",
    slug: "theragun-pro",
    description: "Professional-grade percussive therapy device with multiple attachments and adjustable arm",
    shortDescription: "Pro-grade massage gun with adjustable arm",
    price: 599.99,
    comparePrice: 649.99,
    originalPrice: 649.99,
    images: ["https://ext.same-assets.com/30303030/theragun-pro.jpg"],
    category: "Massage Guns",
    categoryId: 1,
    subcategory: "Professional Grade",
    rating: 4.8,
    reviewCount: 458,
    features: [
      "5 built-in speeds",
      "150-minute battery life",
      "Multiple attachment heads",
      "Adjustable arm for hard-to-reach areas"
    ],
    pros: ["Super quiet operation", "Professional quality", "Ergonomic grip"],
    cons: ["Expensive", "Heavier than some competitors"],
    affiliateLink: "https://www.example.com/affiliate/theragun-pro",
    brand: "Therabody",
    specifications: {
      "Motor": "Professional-Grade",
      "Battery Life": "150 minutes",
      "Weight": "2.9 lbs",
      "Speeds": "5 built-in speeds"
    },
    availability: "In Stock",
    inStock: true,
    bestSeller: true,
    asin: "B087MH4K3V",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-03-20T14:45:00Z"
  },
  {
    id: 2,
    name: "Hypervolt Go",
    slug: "hypervolt-go",
    description: "Compact and lightweight percussive massage device perfect for on-the-go recovery",
    shortDescription: "Portable massage gun for travel",
    price: 199.99,
    comparePrice: 229.99,
    originalPrice: 229.99,
    images: ["https://ext.same-assets.com/30303030/hypervolt-go.jpg"],
    category: "Massage Guns",
    categoryId: 1,
    subcategory: "Portable",
    rating: 4.6,
    reviewCount: 312,
    features: [
      "3 speed settings",
      "2.5 hour battery life",
      "Weighs only 1.5 lbs",
      "2 interchangeable heads"
    ],
    pros: ["Ultra portable", "Good battery life", "Quiet operation"],
    cons: ["Limited attachment options", "Less powerful than full-size models"],
    affiliateLink: "https://www.example.com/affiliate/hypervolt-go",
    brand: "Hyperice",
    specifications: {
      "Motor": "Portable", 
      "Battery Life": "2.5 hours",
      "Weight": "1.5 lbs",
      "Speeds": "3 speed settings"
    },
    availability: "In Stock",
    inStock: true,
    bestSeller: false,
    asin: "B08KFMG5DQ",
    createdAt: "2023-02-10T11:20:00Z",
    updatedAt: "2023-04-15T09:30:00Z"
  },
  {
    id: 3,
    name: "TriggerPoint GRID Foam Roller",
    slug: "triggerpoint-grid-foam-roller",
    description: "Dense foam roller with a patented multi-density exterior designed to replicate the feeling of a massage therapist's hands",
    shortDescription: "Multi-density foam roller for deep tissue massage",
    price: 34.99,
    comparePrice: 39.99,
    originalPrice: 39.99,
    images: ["https://ext.same-assets.com/30303031/grid-foam-roller.jpg"],
    category: "Foam Rollers",
    categoryId: 2,
    subcategory: "Textured",
    rating: 4.7,
    reviewCount: 2156,
    features: [
      "Patented multi-density exterior",
      "Hollow core design",
      "Supports up to 500 lbs",
      "13 inches x 5.5 inches"
    ],
    pros: ["Durable construction", "Effective pattern design", "Portable size"],
    cons: ["Firmer than standard foam rollers", "May be too intense for beginners"],
    affiliateLink: "https://www.example.com/affiliate/triggerpoint-grid",
    brand: "TriggerPoint",
    specifications: {
      "Material": "EVA foam",
      "Length": "13 inches",
      "Diameter": "5.5 inches",
      "Weight Capacity": "500 lbs"
    },
    availability: "In Stock",
    inStock: true,
    bestSeller: true,
    asin: "B0040EGNIU",
    createdAt: "2023-01-05T15:45:00Z",
    updatedAt: "2023-03-12T10:20:00Z"
  },
  {
    id: 4,
    name: "NormaTec PULSE 2.0 Leg Recovery System",
    slug: "normatec-pulse-2-leg-recovery",
    description: "Dynamic compression system using patented pulse technology to enhance blood flow and speed recovery",
    shortDescription: "Premium compression recovery system for legs",
    price: 899.99,
    comparePrice: 995.00,
    originalPrice: 995.00,
    images: ["https://ext.same-assets.com/30303032/normatec-pulse.jpg"],
    category: "Compression Devices",
    categoryId: 3,
    subcategory: "Leg Sleeves",
    rating: 4.9,
    reviewCount: 203,
    features: [
      "7 intensity levels",
      "Bluetooth connectivity",
      "Customizable zones",
      "Rechargeable battery with 2-hour runtime"
    ],
    pros: ["Clinical-grade compression", "Easy to use interface", "Highly effective recovery"],
    cons: ["Expensive", "Takes time to complete sessions"],
    affiliateLink: "https://www.example.com/affiliate/normatec-pulse",
    brand: "NormaTec",
    specifications: {
      "Compression Levels": "7",
      "Battery Life": "2 hours",
      "Connectivity": "Bluetooth",
      "Zones": "5 overlapping zones per leg"
    },
    availability: "In Stock",
    inStock: true,
    bestSeller: false,
    asin: "B07MQKTZN8",
    createdAt: "2023-02-20T13:10:00Z",
    updatedAt: "2023-04-05T11:45:00Z"
  }
];

// Compatibility type for creating products with aliased property names
export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt"> | {
  title?: string;
  imageUrl?: string;
  additionalImages?: string[];
  originalPrice?: number;
  affiliateUrl?: string;
  inStock?: boolean;
  subcategoryId?: number; // Add subcategoryId to ProductInput
  [key: string]: any;
};

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

// Convert aliased properties to the original property names
const normalizeProductInput = (productInput: ProductInput): Omit<Product, "id" | "createdAt" | "updatedAt"> => {
  // Extract aliased properties from input
  const {
    title,
    imageUrl,
    additionalImages,
    originalPrice,
    affiliateUrl,
    inStock,
    ...rest
  } = productInput as any;

  // Create normalized product with original property names
  const images = imageUrl 
    ? [imageUrl, ...(additionalImages || [])]
    : rest.images || [];

  return {
    name: title || rest.name || '',
    images,
    description: rest.description || '',
    slug: rest.slug || '',
    price: rest.price || 0,
    comparePrice: originalPrice || rest.comparePrice,
    category: rest.category || '',
    categoryId: rest.categoryId || 0,
    rating: rest.rating || 0,
    reviewCount: rest.reviewCount || 0,
    affiliateLink: affiliateUrl || rest.affiliateLink,
    availability: inStock !== undefined ? (inStock ? "In Stock" : "Out of Stock") : rest.availability,
    ...rest
  };
};

// Get products from localStorage
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsData = localStorage.getItem(localStorageKeys.PRODUCTS);
    let products: Product[] = [];
    
    if (productsData) {
      const parsedData = JSON.parse(productsData);
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        products = parsedData;
      } else {
        // No valid products found in localStorage, use defaults
        products = DEFAULT_PRODUCTS;
        localStorage.setItem(localStorageKeys.PRODUCTS, JSON.stringify(products));
      }
    } else {
      // No products in localStorage, use defaults
      products = DEFAULT_PRODUCTS;
      localStorage.setItem(localStorageKeys.PRODUCTS, JSON.stringify(products));
    }
    
    // Add backwards compatibility properties to each product
    return products.map(getProductWithBackwardsCompatibility);
  } catch (error) {
    console.error("Error retrieving products:", error);
    // Return default products on error
    return DEFAULT_PRODUCTS.map(getProductWithBackwardsCompatibility);
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
    // Check default products as fallback
    return DEFAULT_PRODUCTS.find(product => product.id === id) || null;
  }
};

// Get product by slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const products = await getProducts();
    return products.find(product => product.slug === slug) || null;
  } catch (error) {
    console.error(`Error retrieving product with slug ${slug}:`, error);
    // Check default products as fallback
    return DEFAULT_PRODUCTS.find(product => product.slug === slug) || null;
  }
};

// Get products by category
export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const products = await getProducts();
    return products.filter(product => product.categoryId === categoryId);
  } catch (error) {
    console.error(`Error retrieving products for category ${categoryId}:`, error);
    // Return filtered default products on error
    return DEFAULT_PRODUCTS.filter(product => product.categoryId === categoryId);
  }
};

// Add product
export const addProduct = async (productInput: ProductInput): Promise<Product> => {
  try {
    const products = await getProducts();
    const normalizedProduct = normalizeProductInput(productInput);
    
    const newProduct: Product = {
      ...normalizedProduct,
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
export const updateProduct = async (id: number, productData: Partial<ProductInput>): Promise<Product | null> => {
  try {
    const products = await getProducts();
    const productIndex = products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      return null;
    }
    
    // Normalize the input data
    const {
      title,
      imageUrl,
      additionalImages,
      originalPrice,
      affiliateUrl,
      inStock,
      ...rest
    } = productData as any;
    
    // Update with normalized data
    const updatedData: Partial<Product> = {
      ...rest
    };
    
    // Handle aliased properties
    if (title !== undefined) updatedData.name = title;
    if (imageUrl !== undefined || additionalImages !== undefined) {
      const currentImages = products[productIndex].images || [];
      const newMainImage = imageUrl || (currentImages.length > 0 ? currentImages[0] : '');
      const newAdditionalImages = additionalImages || (currentImages.length > 1 ? currentImages.slice(1) : []);
      updatedData.images = [newMainImage, ...newAdditionalImages];
    }
    if (originalPrice !== undefined) updatedData.comparePrice = originalPrice;
    if (affiliateUrl !== undefined) updatedData.affiliateLink = affiliateUrl;
    if (inStock !== undefined) updatedData.availability = inStock ? "In Stock" : "Out of Stock";
    
    const updatedProduct = {
      ...products[productIndex],
      ...updatedData,
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
