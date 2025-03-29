
// Constants used throughout the application

// Local storage keys
export const localStorageKeys = {
  HERO_IMAGE: 'hero_image',
  THEME: 'theme',
  WISHLIST: 'wishlist_items',
  WISHLIST_ITEMS: 'wishlist_items', // Adding this to match references in code
  RECENT_SEARCHES: 'recent_searches',
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  USER_ID: 'user_id', // Added for analytics
  VIEWED_PRODUCTS: 'viewed_products',
  USE_LOCAL_FALLBACKS: 'use_local_fallbacks',
  AFFILIATE_CLICKS: 'affiliate_clicks', // Added for affiliate tracking
  ANALYTICS_DATA: 'analytics_data', // Added for analytics
  BLOG_POSTS: 'blog_posts', // Added for blog service
  CATEGORY_CONTENT: 'category_content', // Added for category service
  PRODUCTS: 'products', // Added for product service
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

// Default navigation
export const DEFAULT_NAVIGATION = {
  mainMenu: [
    {
      id: 1,
      title: "Home",
      type: "link",
      url: "/",
      showInHeader: true,
    },
    {
      id: 2,
      title: "Products",
      type: "category-dropdown",
      showInHeader: true,
      items: [] // This will be populated dynamically
    },
    {
      id: 3,
      title: "About",
      type: "link",
      url: "/about",
      showInHeader: true,
    },
    {
      id: 4,
      title: "Blog",
      type: "link",
      url: "/blog",
      showInHeader: true,
    },
    {
      id: 5,
      title: "Contact",
      type: "link",
      url: "/contact",
      showInHeader: true,
    },
  ]
};

// Update Content Security Policy in index.html to include necessary domains
// Note: This is just a reference, actual changes need to be made to index.html
export const CSP_DOMAINS = {
  SCRIPT_SRC: [
    "'self'",
    "https://cdn.gpteng.co",
    "https://polyfill.io",
    "https://cdnjs.cloudflare.com",
    "https://static.cloudflareinsights.com",
    "'unsafe-inline'"
  ],
  IMG_SRC: ["*", "data:"],
  STYLE_SRC: ["'self'", "'unsafe-inline'"]
};

