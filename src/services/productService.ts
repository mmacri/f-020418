
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Product {
  id: number;
  slug: string;
  title?: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  features?: string[];
  imageUrl: string;
  additionalImages?: string[];
  inStock: boolean;
  category: string;
  subcategory?: string;
  specs?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
  bestSeller?: boolean;
  comparisonStats?: Record<string, any>;
  affiliateUrl?: string;
  affiliateLink?: string;
  asin?: string;
}

// Fetch all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    // Try to get products from Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching products from Supabase:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      // Transform the data to match the Product interface
      return data.map(product => ({
        ...product,
        // Ensure these fields have default values if missing
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        price: product.price || 0,
        inStock: product.inStock !== undefined ? product.inStock : true,
        features: product.features || [],
        additionalImages: product.additionalImages || []
      }));
    }
    
    // Fall back to mock data if no data in Supabase
    return generateMockProducts();
  } catch (error) {
    console.error('Error in getProducts:', error);
    // Fall back to mock data if error
    return generateMockProducts();
  }
};

// Get product by ID
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
    
    return data as Product;
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
};

// Get product by slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error fetching product by slug:', error);
      return null;
    }
    
    return data as Product;
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return null;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('id');
    
    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
    
    return data as Product[];
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return [];
  }
};

// Get products by subcategory
export const getProductsBySubcategory = async (category: string, subcategory: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('subcategory', subcategory)
      .order('id');
    
    if (error) {
      console.error('Error fetching products by subcategory:', error);
      return [];
    }
    
    return data as Product[];
  } catch (error) {
    console.error('Error in getProductsBySubcategory:', error);
    return [];
  }
};

// Add a new product
export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
      return null;
    }
    
    toast.success('Product added successfully');
    return data as Product;
  } catch (error) {
    console.error('Error in addProduct:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Update an existing product
export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      return null;
    }
    
    toast.success('Product updated successfully');
    return data as Product;
  } catch (error) {
    console.error('Error in updateProduct:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Delete a product
export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
      return false;
    }
    
    toast.success('Product deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    toast.error('An unexpected error occurred');
    return false;
  }
};

// Helper function to generate mock products if needed
const generateMockProducts = (): Product[] => {
  return [
    {
      id: 1,
      slug: 'theragun-elite',
      name: 'Theragun Elite',
      title: 'Theragun Elite Massage Gun',
      description: 'Premium percussion massage device for deep muscle treatment.',
      shortDescription: 'Professional-grade massage gun with 5 attachments and 5 speeds.',
      price: 399.99,
      originalPrice: 449.99,
      rating: 4.8,
      reviewCount: 1245,
      features: [
        'Quiet Force Technology',
        '120-minute battery life',
        '5 built-in speeds',
        '40 lbs of force',
        'Bluetooth app integration'
      ],
      imageUrl: 'https://ext.same-assets.com/1001010126/massage-gun-category.jpg',
      additionalImages: [
        'https://ext.same-assets.com/30303031/foam-roller-category.jpg',
        'https://ext.same-assets.com/30303032/compression-category.jpg'
      ],
      inStock: true,
      category: 'massage-guns',
      specs: {
        'Weight': '2.2 lbs',
        'Dimensions': '9.5 x 6.7 x 2.8 inches',
        'Speed Range': '1750-2400 PPM',
        'Battery Life': '120 minutes',
        'Noise Level': '60-65 dB'
      },
      bestSeller: true,
      affiliateUrl: 'https://www.amazon.com/Theragun-Elite-Massage-Gun-Professionals/dp/B086Z6YDPL/'
    },
    // Add more mock products as needed
  ];
};
