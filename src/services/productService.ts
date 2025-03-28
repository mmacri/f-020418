
import { toast } from "@/hooks/use-toast";
import { generateAffiliateLink } from "@/lib/amazon-api";

// Product type definition
export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  additionalImages?: string[];
  category: string;
  subcategory?: string;
  asin: string;
  rating: number;
  reviewCount: number;
  features?: string[];
  affiliateUrl: string;
  bestSeller?: boolean;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock product data
let PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Theragun Pro - Professional Massage Gun",
    slug: "theragun-pro",
    description: "Professional-grade percussive therapy device with advanced features for enhanced recovery.",
    shortDescription: "Top-of-the-line percussion massager with multiple attachments",
    price: 599.99,
    originalPrice: 699.99,
    discount: 14,
    imageUrl: "https://ext.same-assets.com/1001010126/theragun-pro.jpg",
    additionalImages: [
      "https://ext.same-assets.com/1001010126/theragun-pro-1.jpg",
      "https://ext.same-assets.com/1001010126/theragun-pro-2.jpg",
      "https://ext.same-assets.com/1001010126/theragun-pro-3.jpg"
    ],
    category: "massage-guns",
    subcategory: "percussion",
    asin: "B07TRSYXB9",
    rating: 4.7,
    reviewCount: 1254,
    features: [
      "Professional-grade percussive therapy device",
      "Rotating arm and ergonomic multi-grip",
      "300-minute battery life",
      "Smart app integration with Bluetooth",
      "Customizable speed range (1750-2400 PPM)",
      "OLED screen with force meter",
      "Comes with 6 attachments"
    ],
    affiliateUrl: "https://www.amazon.com/dp/B07TRSYXB9?tag=recoveryessentials-20",
    bestSeller: true,
    inStock: true,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-04-20T14:15:00Z"
  },
  {
    id: 2,
    title: "Hypervolt Plus - Bluetooth Enabled Percussion Massage Device",
    slug: "hypervolt-plus",
    description: "Bluetooth-enabled percussion massage device designed for effective muscle recovery and pain relief.",
    shortDescription: "Powerful and quiet percussion massager with Bluetooth connectivity",
    price: 349.99,
    imageUrl: "https://ext.same-assets.com/1001010127/hypervolt-plus.jpg",
    category: "massage-guns",
    subcategory: "percussion",
    asin: "B07XLKFK6Q",
    rating: 4.5,
    reviewCount: 892,
    features: [
      "3 speeds of powerful percussion",
      "Quiet Glide™ technology",
      "Bluetooth connectivity with app integration",
      "5 interchangeable head attachments",
      "Up to 3 hours of use per charge",
      "TSA-approved for carry-on"
    ],
    affiliateUrl: "https://www.amazon.com/dp/B07XLKFK6Q?tag=recoveryessentials-20",
    inStock: true,
    createdAt: "2023-02-10T09:45:00Z",
    updatedAt: "2023-04-15T11:20:00Z"
  },
  {
    id: 3,
    title: "TriggerPoint GRID Foam Roller",
    slug: "triggerpoint-grid-foam-roller",
    description: "Patented design offers a superior, multi-density foam surface for the relief of muscular pain and tightness.",
    shortDescription: "Multi-density foam roller for effective myofascial release",
    price: 34.99,
    originalPrice: 39.99,
    discount: 12,
    imageUrl: "https://ext.same-assets.com/30303031/foam-roller-category.jpg",
    category: "foam-rollers",
    subcategory: "textured",
    asin: "B0040EGNIU",
    rating: 4.8,
    reviewCount: 2145,
    features: [
      "Patented multi-density foam design",
      "Compact size (13 inches)",
      "Durable construction supports up to 500 lbs",
      "Unique surface pattern designed to replicate massage hands",
      "Environmental design uses less foam than traditional rollers"
    ],
    affiliateUrl: "https://www.amazon.com/dp/B0040EGNIU?tag=recoveryessentials-20",
    bestSeller: true,
    inStock: true,
    createdAt: "2023-01-05T15:20:00Z",
    updatedAt: "2023-03-25T08:30:00Z"
  }
];

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...PRODUCTS];
};

// Get product by ID
export const getProductById = async (id: number): Promise<Product | null> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const product = PRODUCTS.find(p => p.id === id);
  return product || null;
};

// Get product by slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const product = PRODUCTS.find(p => p.slug === slug);
  return product || null;
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return PRODUCTS.filter(p => p.category === category);
};

// Create new product
export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Generate affiliate URL if not provided
  const affiliateUrl = product.affiliateUrl || generateAffiliateLink(product.asin);
  
  // Create new product with ID and dates
  const newProduct: Product = {
    ...product,
    id: Math.max(...PRODUCTS.map(p => p.id)) + 1,
    affiliateUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  PRODUCTS.push(newProduct);
  
  toast({
    title: "Product created",
    description: `${newProduct.title} has been added successfully`
  });
  
  return newProduct;
};

// Update product
export const updateProduct = async (id: number, updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const index = PRODUCTS.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Product with ID ${id} not found`);
  }
  
  // Update the product
  const updatedProduct: Product = {
    ...PRODUCTS[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  PRODUCTS[index] = updatedProduct;
  
  toast({
    title: "Product updated",
    description: `${updatedProduct.title} has been updated successfully`
  });
  
  return updatedProduct;
};

// Delete product
export const deleteProduct = async (id: number): Promise<boolean> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = PRODUCTS.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Product with ID ${id} not found`);
  }
  
  const productTitle = PRODUCTS[index].title;
  PRODUCTS = PRODUCTS.filter(p => p.id !== id);
  
  toast({
    title: "Product deleted",
    description: `${productTitle} has been removed successfully`
  });
  
  return true;
};
