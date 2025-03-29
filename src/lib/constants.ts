
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
  USER_ID: 'recovery-essentials-user-id',
  
  // Application state
  WISHLIST: 'recovery-essentials-wishlist',
  WISHLIST_ITEMS: 'recovery-essentials-wishlist-items',
  VIEWED_PRODUCTS: 'recovery-essentials-viewed-products',
  COMPARISON_PRODUCTS: 'recovery-essentials-comparison-products',
  
  // Feature flags
  FEATURES: 'recovery-essentials-features',
  
  // Analytics and tracking
  ANALYTICS_DATA: 'recovery-essentials-analytics-data',
  AFFILIATE_CLICKS: 'recovery-essentials-affiliate-clicks',
  
  // Content storage
  BLOG_POSTS: 'recovery-essentials-blog-posts',
  PRODUCTS: 'recovery-essentials-products',
  CATEGORY_CONTENT: 'recovery-essentials-category-content'
};

// Image fallback URLs
export const imageUrls = {
  DEFAULT_FALLBACK: '/placeholder.svg',
  REMOTE_FALLBACK: 'https://placehold.co/600x400?text=Image+Not+Found',
  PRODUCT_DEFAULT: 'https://placehold.co/600x400?text=Product+Image',
  CATEGORY_DEFAULT: 'https://placehold.co/600x400?text=Category+Image',
  HERO_DEFAULT: 'https://placehold.co/1200x400?text=Recovery+Essentials',
  BLOG_DEFAULT: 'https://placehold.co/800x400?text=Blog+Post',  // Added missing BLOG_DEFAULT
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

// Default navigation structure
export const DEFAULT_NAVIGATION = {
  mainMenu: [
    {
      id: 1,
      title: "Home",
      type: "link",
      url: "/",
      showInHeader: true
    },
    {
      id: 2,
      title: "Categories",
      type: "category-dropdown",
      showInHeader: true,
      items: [] // This will be populated dynamically
    },
    {
      id: 3,
      title: "Blog",
      type: "link",
      url: "/blog",
      showInHeader: true
    },
    {
      id: 4,
      title: "About",
      type: "link",
      url: "/about",
      showInHeader: true
    },
    {
      id: 5,
      title: "Contact",
      type: "link",
      url: "/contact",
      showInHeader: false
    }
  ],
  footerLinks: [
    {
      id: 1,
      title: "Company",
      items: [
        { id: 101, title: "About Us", url: "/about" },
        { id: 102, title: "Contact", url: "/contact" },
        { id: 103, title: "Privacy Policy", url: "/privacy-policy" },
        { id: 104, title: "Terms of Service", url: "/terms" }
      ]
    },
    {
      id: 2,
      title: "Resources",
      items: [
        { id: 201, title: "Blog", url: "/blog" },
        { id: 202, title: "Recovery Guide", url: "/recovery-guide" },
        { id: 203, title: "Newsletter", url: "/newsletter" }
      ]
    },
    {
      id: 3,
      title: "Product Categories",
      items: [] // This will be populated dynamically
    }
  ]
};
