// Define the API client with proper TypeScript types
import { Product } from '@/services/productService';

// Mock function to fetch products (used by other functions)
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // In a real app, this would be an API call
    const productsData = localStorage.getItem('products');
    if (productsData) {
      return JSON.parse(productsData);
    }
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Assuming the location of the string/number comparison is in a function like this:
export const getCategoryProducts = async (categoryId: string) => {
  try {
    const products = await fetchProducts();
    // Compare with string categoryId instead of parsing to int
    return products.filter(product => String(product.categoryId) === categoryId);
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    return [];
  }
};

// API client class
class ApiClient {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheDuration: number;

  constructor(baseUrl: string = '', cacheDuration: number = 5 * 60 * 1000) {
    this.baseUrl = baseUrl;
    this.cache = new Map();
    this.cacheDuration = cacheDuration;
  }

  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    if (!params) return `api_cache_${endpoint}`;
    return `api_cache_${endpoint}_${JSON.stringify(params)}`;
  }

  private saveToCache(key: string, data: any): void {
    try {
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      });
      
      // Also save to localStorage for persistence
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  private getFromCache(key: string): any | null {
    try {
      // First check memory cache
      const cachedData = this.cache.get(key);
      
      if (cachedData && Date.now() - cachedData.timestamp < this.cacheDuration) {
        return cachedData.data;
      }
      
      // Then check localStorage
      const storedData = localStorage.getItem(key);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (Date.now() - parsed.timestamp < this.cacheDuration) {
          // Refresh the memory cache
          this.cache.set(key, parsed);
          return parsed.data;
        }
        
        // Clean up expired localStorage item
        localStorage.removeItem(key);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting from cache:', error);
      return null;
    }
  }

  clearCache(): void {
    // Clear memory cache
    this.cache.clear();
    
    // Clear localStorage cache
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith('api_cache_'));
      cacheKeys.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>, skipCache: boolean = false): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);
    
    if (!skipCache) {
      const cachedData = this.getFromCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      // In a real app, this would be a fetch call
      // For now, we'll simulate some data based on the endpoint
      
      let result: any;
      
      // Mock API responses based on endpoint patterns
      if (endpoint.startsWith('/products')) {
        const products = await fetchProducts();
        
        if (endpoint === '/products') {
          result = products;
        } else {
          // Single product request
          const idMatch = endpoint.match(/\/products\/(\d+)/);
          if (idMatch) {
            const productId = parseInt(idMatch[1], 10);
            result = products.find(p => p.id === productId) || null;
          }
          
          // Reviews request
          const reviewsMatch = endpoint.match(/\/products\/(\d+)\/reviews/);
          if (reviewsMatch) {
            // Mock reviews data
            result = {
              data: [],
              pagination: {
                total: 0,
                page: 1,
                limit: 10
              }
            };
          }
        }
      } else {
        // Default mock response
        result = { message: 'Mock data for ' + endpoint };
      }
      
      // Save to cache
      this.saveToCache(cacheKey, result);
      
      return result as T;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      // In a real app, this would be a fetch call
      console.log(`POST request to ${endpoint} with data:`, data);
      
      // Mock successful response
      const result = { success: true, data };
      
      // Clear related cache entries
      this.clearCacheByEndpoint(endpoint.split('/')[1]);
      
      return result as T;
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      // In a real app, this would be a fetch call
      console.log(`PUT request to ${endpoint} with data:`, data);
      
      // Mock successful response
      const result = { success: true, data };
      
      // Clear related cache entries
      this.clearCacheByEndpoint(endpoint.split('/')[1]);
      
      return result as T;
    } catch (error) {
      console.error(`Error putting to ${endpoint}:`, error);
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      // In a real app, this would be a fetch call
      console.log(`DELETE request to ${endpoint}`);
      
      // Mock successful response
      const result = { success: true };
      
      // Clear related cache entries
      this.clearCacheByEndpoint(endpoint.split('/')[1]);
      
      return result as T;
    } catch (error) {
      console.error(`Error deleting from ${endpoint}:`, error);
      throw error;
    }
  }

  private clearCacheByEndpoint(resourceType: string): void {
    try {
      const keys = Object.keys(localStorage);
      const relatedCacheKeys = keys.filter(key => 
        key.startsWith(`api_cache_/${resourceType}`) || 
        key === `api_cache_/${resourceType}`
      );
      
      relatedCacheKeys.forEach(key => {
        localStorage.removeItem(key);
        
        // Also remove from memory cache
        const memCacheKey = key.replace('api_cache_', '');
        this.cache.delete(memCacheKey);
      });
    } catch (error) {
      console.error('Error clearing related cache:', error);
    }
  }
}

// Export a singleton instance
export const api = new ApiClient();
