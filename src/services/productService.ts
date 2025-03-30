import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export interface SupabaseProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number | null;
  sale_price: number | null;
  rating: number | null;
  image_url: string | null;
  in_stock: boolean | null;
  availability: boolean | null;
  category_id: string | null;
  attributes: Json | null;
  specifications: Json | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number | string;
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
  images?: (string | { url: string })[];
  additionalImages?: string[];
  inStock: boolean;
  category: string;
  categoryId?: string | number;
  subcategory?: string;
  subcategoryId?: string | number;
  specifications?: Record<string, string>;
  specs?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
  bestSeller?: boolean;
  comparisonStats?: Record<string, any>;
  affiliateUrl?: string;
  affiliateLink?: string;
  asin?: string;
  brand?: string;
  pros?: string[];
}

export const mapSupabaseProductToProduct = (product: any): Product => {
  if (!product) {
    console.error('Received null or undefined product in mapSupabaseProductToProduct');
    return {
      id: 'default',
      slug: 'default',
      name: 'Product Not Available',
      description: '',
      price: 0,
      rating: 0,
      reviewCount: 0,
      imageUrl: '',
      inStock: false,
      category: '',
    };
  }
  
  try {
    const attributes = product.attributes ? 
      (typeof product.attributes === 'string' ? 
        JSON.parse(product.attributes) : 
        product.attributes) : 
      {};
    
    const specifications = product.specifications ? 
      (typeof product.specifications === 'string' ? 
        JSON.parse(product.specifications) : 
        product.specifications) : 
      {};
    
    const productId = product.id ? product.id : 'unknown';
    
    return {
      id: productId,
      slug: product.slug || 'unknown',
      name: product.name || 'Unnamed Product',
      description: product.description || '',
      price: product.price || 0,
      originalPrice: product.sale_price || undefined,
      rating: product.rating || 0,
      reviewCount: attributes.reviewCount || 0,
      imageUrl: product.image_url || '',
      images: product.image_url ? [product.image_url] : [],
      inStock: product.in_stock !== false, // Default to true unless explicitly false
      category: attributes.category || '',
      categoryId: product.category_id,
      subcategory: attributes.subcategory || '',
      specifications: specifications,
      specs: specifications,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      features: Array.isArray(attributes.features) ? attributes.features : [],
      bestSeller: !!attributes.bestSeller,
      brand: attributes.brand || '',
      pros: Array.isArray(attributes.pros) ? attributes.pros : []
    };
  } catch (error) {
    console.error('Error mapping product:', error, product);
    return {
      id: product.id || 'error',
      slug: product.slug || 'error',
      name: product.name || 'Error Mapping Product',
      description: 'There was an error processing this product data.',
      price: 0,
      rating: 0,
      reviewCount: 0,
      imageUrl: '',
      inStock: false,
      category: '',
    };
  }
};

const mapProductToSupabaseProduct = (product: Partial<Product>) => {
  return {
    id: product.id?.toString(),
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    sale_price: product.originalPrice,
    rating: product.rating,
    image_url: product.imageUrl || (product.images && product.images.length > 0 ? 
      typeof product.images[0] === 'string' ? product.images[0] : (product.images[0] as { url: string }).url : ''),
    in_stock: product.inStock,
    category_id: product.categoryId?.toString(),
    specifications: product.specifications || product.specs,
    attributes: {
      reviewCount: product.reviewCount,
      features: product.features,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      bestSeller: product.bestSeller,
      pros: product.pros
    }
  };
};

export const extractImageUrl = (image: string | { url: string } | undefined): string => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url;
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching products from Supabase:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      return data.map(product => mapSupabaseProductToProduct(product as SupabaseProduct));
    }
    
    return generateMockProducts();
  } catch (error) {
    console.error('Error in getProducts:', error);
    return generateMockProducts();
  }
};

export const getProductById = async (id: number | string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id.toString())
      .single();
    
    if (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
    
    return mapSupabaseProductToProduct(data as SupabaseProduct);
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
};

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
    
    return mapSupabaseProductToProduct(data as SupabaseProduct);
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return null;
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();
      
    if (categoryData) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryData.id)
        .order('id');
      
      if (error) {
        console.error('Error fetching products by category:', error);
        return [];
      }
      
      return data.map(product => mapSupabaseProductToProduct(product as SupabaseProduct));
    }
    
    return [];
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return [];
  }
};

export const getProductsBySubcategory = async (category: string, subcategory: string): Promise<Product[]> => {
  try {
    const products = await getProductsByCategory(category);
    
    return products.filter(
      product => product.subcategory?.toLowerCase() === subcategory.toLowerCase()
    );
  } catch (error) {
    console.error('Error in getProductsBySubcategory:', error);
    return [];
  }
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  try {
    const supabaseProduct = mapProductToSupabaseProduct(product);
    
    const { data, error } = await supabase
      .from('products')
      .insert([supabaseProduct])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
      return null;
    }
    
    toast.success('Product added successfully');
    return mapSupabaseProductToProduct(data as SupabaseProduct);
  } catch (error) {
    console.error('Error in addProduct:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
};

export const createProduct = addProduct;

export const updateProduct = async (id: number | string, product: Partial<Product>): Promise<Product | null> => {
  try {
    const supabaseProduct = mapProductToSupabaseProduct({
      ...product,
      id: id
    });
    
    delete supabaseProduct.id; // Remove id from update payload
    
    const { data, error } = await supabase
      .from('products')
      .update(supabaseProduct)
      .eq('id', id.toString())
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      return null;
    }
    
    toast.success('Product updated successfully');
    return mapSupabaseProductToProduct(data as SupabaseProduct);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
};

export const deleteProduct = async (id: number | string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id.toString());
    
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

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    if (!query.trim()) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('rating', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error searching products:', error);
      return [];
    }
    
    return data.map(product => mapSupabaseProductToProduct(product as SupabaseProduct));
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return [];
  }
};

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
      images: ['https://ext.same-assets.com/1001010126/massage-gun-category.jpg'],
      additionalImages: [
        'https://ext.same-assets.com/30303031/foam-roller-category.jpg',
        'https://ext.same-assets.com/30303032/compression-category.jpg'
      ],
      inStock: true,
      category: 'massage-guns',
      categoryId: 'massage-guns',
      specifications: {
        'Weight': '2.2 lbs',
        'Dimensions': '9.5 x 6.7 x 2.8 inches',
        'Speed Range': '1750-2400 PPM',
        'Battery Life': '120 minutes',
        'Noise Level': '60-65 dB'
      },
      specs: {
        'Weight': '2.2 lbs',
        'Dimensions': '9.5 x 6.7 x 2.8 inches',
        'Speed Range': '1750-2400 PPM',
        'Battery Life': '120 minutes',
        'Noise Level': '60-65 dB'
      },
      bestSeller: true,
      affiliateUrl: 'https://www.amazon.com/Theragun-Elite-Massage-Gun-Professionals/dp/B086Z6YDPL/',
      brand: 'Theragun',
      pros: [
        'Extremely quiet operation',
        'Ergonomic multi-grip design',
        'Smart app integration',
        'Excellent build quality'
      ]
    }
  ];
};
