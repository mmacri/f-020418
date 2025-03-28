
import { toast } from "@/hooks/use-toast";

// Cache configuration
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Base API configuration
type ApiConfig = {
  baseUrl: string;
  headers?: Record<string, string>;
}

const defaultConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || "https://api.recoveryessentials.com",
  headers: {
    "Content-Type": "application/json",
  }
};

// Cache helper functions
export function getCache<T>(key: string): T | null {
  const cachedData = localStorage.getItem(`api_cache_${key}`);
  
  if (cachedData) {
    try {
      const { data, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - timestamp < CACHE_DURATION) {
        console.log(`Using cached data for: ${key}`);
        return data as T;
      } else {
        // Cache expired, remove it
        localStorage.removeItem(`api_cache_${key}`);
      }
    } catch (error) {
      console.error("Error parsing cached data:", error);
      localStorage.removeItem(`api_cache_${key}`);
    }
  }
  
  return null;
}

export function setCache<T>(key: string, data: T): void {
  const cacheData = {
    timestamp: Date.now(),
    data
  };
  
  try {
    localStorage.setItem(`api_cache_${key}`, JSON.stringify(cacheData));
    console.log(`Cached data for: ${key}`);
  } catch (error) {
    console.error("Error caching data:", error);
    // If localStorage is full, clear older cache entries
    clearOldCache();
  }
}

function clearOldCache() {
  const keys = Object.keys(localStorage);
  const cacheKeys = keys.filter(key => key.startsWith('api_cache_'));
  
  if (cacheKeys.length > 0) {
    // Sort by timestamp (oldest first)
    cacheKeys.sort((a, b) => {
      const aData = JSON.parse(localStorage.getItem(a) || '{"timestamp":0}');
      const bData = JSON.parse(localStorage.getItem(b) || '{"timestamp":0}');
      return aData.timestamp - bData.timestamp;
    });
    
    // Remove the oldest 20% of cache entries
    const removeCount = Math.max(1, Math.floor(cacheKeys.length * 0.2));
    cacheKeys.slice(0, removeCount).forEach(key => localStorage.removeItem(key));
    
    console.log(`Cleared ${removeCount} old cache entries`);
  }
}

// Main API client
export class ApiClient {
  private config: ApiConfig;
  
  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      this.config.headers = {
        ...this.config.headers,
        Authorization: `Bearer ${token}`
      };
    }
  }
  
  // Generic request method
  private async request<T>(
    endpoint: string, 
    method: string = 'GET', 
    data?: any,
    useCache: boolean = true,
    cacheKey?: string
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const actualCacheKey = cacheKey || `${method}_${endpoint}`;
    
    // Try cache for GET requests
    if (method === 'GET' && useCache) {
      const cachedData = getCache<T>(actualCacheKey);
      if (cachedData) return cachedData;
    }
    
    // In development mode, use mock data
    if (import.meta.env.DEV) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        // This is where we'd integrate with the mock services
        const mockResponse = await this.getMockResponse<T>(endpoint, method, data);
        
        // Cache GET responses
        if (method === 'GET' && useCache) {
          setCache(actualCacheKey, mockResponse);
        }
        
        return mockResponse;
      } catch (error: any) {
        console.error(`API ${method} ${endpoint} error:`, error);
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred",
          variant: "destructive"
        });
        throw error;
      }
    }
    
    // For production, make actual API requests
    try {
      const options: RequestInit = {
        method,
        headers: this.config.headers,
        body: data ? JSON.stringify(data) : undefined,
      };
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }
      
      const responseData = await response.json() as T;
      
      // Cache GET responses
      if (method === 'GET' && useCache) {
        setCache(actualCacheKey, responseData);
      }
      
      return responseData;
    } catch (error: any) {
      console.error(`API ${method} ${endpoint} error:`, error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      throw error;
    }
  }
  
  // Mock response handler (for development)
  private async getMockResponse<T>(endpoint: string, method: string, data?: any): Promise<T> {
    // Import mock services dynamically to avoid circular dependencies
    const productService = await import('@/services/productService');
    const categoryService = await import('@/services/categoryService');
    const userService = await import('@/services/userService');
    const blogService = await import('@/services/blogService');
    
    // Parse endpoint to determine the resource
    if (endpoint.startsWith('/products')) {
      if (endpoint === '/products') {
        if (method === 'GET') return productService.getProducts() as unknown as T;
        if (method === 'POST') return productService.createProduct(data) as unknown as T;
      }
      
      const productId = Number(endpoint.split('/').pop());
      if (!isNaN(productId)) {
        if (method === 'GET') return productService.getProductById(productId) as unknown as T;
        if (method === 'PUT') return productService.updateProduct(productId, data) as unknown as T;
        if (method === 'DELETE') return productService.deleteProduct(productId) as unknown as T;
      }
      
      // Handle product by slug
      const slug = endpoint.split('/').pop();
      if (slug && !endpoint.includes('reviews')) {
        return productService.getProductBySlug(slug) as unknown as T;
      }
      
      // Handle product reviews
      if (endpoint.includes('reviews')) {
        const productId = Number(endpoint.split('/')[2]);
        
        if (method === 'GET') {
          // Mock reviews data
          return {
            data: [
              {
                id: 1,
                productId,
                userId: 1,
                userName: "John D.",
                rating: 4.5,
                title: "Great product!",
                comment: "This massage gun has really helped with my recovery after workouts.",
                createdAt: "2023-05-15T10:30:00Z"
              },
              {
                id: 2,
                productId,
                userId: 2,
                userName: "Sarah M.",
                rating: 5,
                title: "Worth every penny",
                comment: "The battery life is impressive and the different attachments are very useful.",
                createdAt: "2023-06-20T14:45:00Z"
              }
            ],
            pagination: {
              total: 2,
              page: 1,
              pageSize: 10
            }
          } as unknown as T;
        }
      }
    }
    
    if (endpoint.startsWith('/categories')) {
      if (endpoint === '/categories') {
        if (method === 'GET') return categoryService.getCategories() as unknown as T;
        if (method === 'POST') return categoryService.createCategory(data) as unknown as T;
      }
      
      const categoryId = Number(endpoint.split('/').pop());
      if (!isNaN(categoryId)) {
        if (method === 'GET') return categoryService.getCategoryById(categoryId) as unknown as T;
        if (method === 'PUT') return categoryService.updateCategory(categoryId, data) as unknown as T;
        if (method === 'DELETE') return categoryService.deleteCategory(categoryId) as unknown as T;
      }
      
      // Handle category by slug
      const slug = endpoint.split('/').pop();
      if (slug) {
        return categoryService.getCategoryBySlug(slug) as unknown as T;
      }
    }
    
    if (endpoint.startsWith('/auth')) {
      if (endpoint === '/auth/login') {
        return userService.login(data) as unknown as T;
      }
      
      if (endpoint === '/auth/register') {
        return userService.register(data) as unknown as T;
      }
      
      if (endpoint === '/auth/logout') {
        return userService.logout() as unknown as T;
      }
    }
    
    if (endpoint.startsWith('/users')) {
      if (endpoint === '/users') {
        return userService.getUsers() as unknown as T;
      }
    }
    
    if (endpoint.startsWith('/blog')) {
      if (endpoint === '/blog/posts') {
        return blogService.getAllPosts() as unknown as T;
      }
      
      // Handle blog post by slug
      if (endpoint.includes('/blog/posts/')) {
        const slug = endpoint.split('/').pop();
        if (slug) {
          return blogService.getBlogPostBySlug(slug) as unknown as T;
        }
      }
    }
    
    // Default fallback
    throw new Error(`Mock API endpoint not implemented: ${method} ${endpoint}`);
  }
  
  // Convenience methods
  public async get<T>(endpoint: string, useCache: boolean = true, cacheKey?: string): Promise<T> {
    return this.request<T>(endpoint, 'GET', undefined, useCache, cacheKey);
  }
  
  public async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, 'POST', data, false);
  }
  
  public async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, 'PUT', data, false);
  }
  
  public async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', undefined, false);
  }
  
  // Clear all API cache
  public clearCache(): void {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith('api_cache_'));
    
    cacheKeys.forEach(key => localStorage.removeItem(key));
    console.log(`Cleared ${cacheKeys.length} cache entries`);
    
    toast({
      title: "Cache cleared",
      description: "All cached data has been cleared"
    });
  }
}

// Export a default instance
export const api = new ApiClient();
