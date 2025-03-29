// Constants used throughout the application

// Local storage keys
export const localStorageKeys = {
  HERO_IMAGE: 'hero_image',
  THEME: 'theme',
  WISHLIST: 'wishlist_items',
  RECENT_SEARCHES: 'recent_searches',
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  VIEWED_PRODUCTS: 'viewed_products',
  USE_LOCAL_FALLBACKS: 'use_local_fallbacks',
  // Add any other localStorage keys here
};

// API endpoints
export const apiEndpoints = {
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  REVIEWS: '/api/reviews',
  USERS: '/api/users',
  AUTH: '/api/auth',
};

// Default values
export const defaults = {
  ITEMS_PER_PAGE: 12,
  SEARCH_DEBOUNCE_MS: 300,
  MAX_RECENT_SEARCHES: 5,
  MAX_VIEWED_PRODUCTS: 10,
};

// Route paths
export const routes = {
  HOME: '/',
  PRODUCT: '/product',
  CATEGORY: '/categories',
  BLOG: '/blog',
  ABOUT: '/about',
  CONTACT: '/contact',
  ADMIN: '/admin',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  CHECKOUT: '/checkout',
  COMPARE: '/compare',
};

// Breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Animation durations
export const animationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Default SEO values
export const defaultSEO = {
  title: 'Recovery Essentials - Best Recovery Equipment',
  description: 'Find the best recovery equipment with our expert reviews and comparisons',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://recoveryessentials.com/',
    site_name: 'Recovery Essentials',
  },
};
