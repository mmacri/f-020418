
/**
 * Application-wide constants
 */

// Local storage keys
export const localStorageKeys = {
  // User preferences
  THEME: 'recovery-essentials-theme',
  USE_LOCAL_FALLBACKS: 'recovery-essentials-use-local-fallbacks',
  HERO_IMAGE: 'recovery-essentials-hero-image',
  
  // Authentication
  AUTH_TOKEN: 'recovery-essentials-auth-token',
  USER_DATA: 'recovery-essentials-user-data',
  
  // Application state
  WISHLIST: 'recovery-essentials-wishlist',
  VIEWED_PRODUCTS: 'recovery-essentials-viewed-products',
  COMPARISON_PRODUCTS: 'recovery-essentials-comparison-products',
  
  // Feature flags
  FEATURES: 'recovery-essentials-features'
};

// Image fallback URLs
export const imageUrls = {
  DEFAULT_FALLBACK: '/placeholder.svg',
  REMOTE_FALLBACK: 'https://placehold.co/600x400?text=Image+Not+Found',
  PRODUCT_DEFAULT: 'https://placehold.co/600x400?text=Product+Image',
  CATEGORY_DEFAULT: 'https://placehold.co/600x400?text=Category+Image',
  HERO_DEFAULT: 'https://placehold.co/1200x400?text=Recovery+Essentials',
  AVATAR_DEFAULT: 'https://placehold.co/200x200?text=User'
};

// API endpoints and configuration
export const apiConfig = {
  BASE_URL: '/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3
};

// Application routes
export const routes = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  BLOG: '/blog',
  ADMIN: '/admin'
};
