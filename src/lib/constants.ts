
/**
 * Constants used throughout the application
 */

/**
 * Local Storage Key constants
 */
export const localStorageKeys = {
  // User preferences
  THEME: 'recovery-essentials-theme',
  USE_LOCAL_FALLBACKS: 'recovery-essentials-use-local-fallbacks',
  
  // Content storage
  HERO_IMAGE: 'recovery-essentials-hero-image',
  PRODUCTS: 'recovery-essentials-products',
  CATEGORIES: 'recovery-essentials-categories',
  SUBCATEGORIES: 'recovery-essentials-subcategories',
  CATEGORY_CONTENT: 'recovery-essentials-category-content',
  BLOG_POSTS: 'recovery-essentials-blog-posts',
  BLOG_CATEGORIES: 'recovery-essentials-blog-categories',
  
  // User data
  USER_FAVORITES: 'recovery-essentials-favorites',
  RECENT_VIEWS: 'recovery-essentials-recent-views',
  COMPARISON_PRODUCTS: 'recovery-essentials-comparison-products',
  WISHLIST_ITEMS: 'recovery-essentials-wishlist-items',
  
  // Analytics and tracking
  AFFILIATE_CLICKS: 'recovery-essentials-affiliate-clicks',
  ANALYTICS_DATA: 'recovery-essentials-analytics-data',
  USER_ID: 'recovery-essentials-user-id',
  
  // Admin data
  ADMIN_SETTINGS: 'recovery-essentials-admin-settings',
};

/**
 * Default image URLs
 */
export const imageUrls = {
  // General placeholders
  PLACEHOLDER: '/placeholder.svg',
  DEFAULT_FALLBACK: '/placeholder.svg',
  
  // Hero images
  HERO_DEFAULT: 'https://ext.same-assets.com/1001010126/massage-gun-category.jpg',
  
  // Category defaults
  CATEGORY_DEFAULT: 'https://ext.same-assets.com/30303031/foam-roller-category.jpg',
  
  // Product defaults
  PRODUCT_DEFAULT: 'https://ext.same-assets.com/30303030/product-placeholder.jpg',
  
  // Blog defaults
  BLOG_DEFAULT: 'https://ext.same-assets.com/30303034/blog-placeholder.jpg',
  
  // User defaults
  AVATAR_DEFAULT: 'https://ext.same-assets.com/30303035/avatar-placeholder.jpg',
};

/**
 * Default main menu items for Header component
 */
export const DEFAULT_MAIN_MENU = [
  { name: 'Home', href: '/' },
  { name: 'Categories', href: '/categories' },
  { name: 'Compare', href: '/product-comparison' },
  { name: 'Blog', href: '/blog' }
];

/**
 * Define navigation item interface with optional mainMenu
 */
interface NavigationItem {
  name: string;
  href: string;
}

/**
 * Define the navigation type with mainMenu property
 */
interface Navigation extends Array<NavigationItem> {
  mainMenu?: NavigationItem[];
}

/**
 * Default navigation items
 */
export const DEFAULT_NAVIGATION: Navigation = [
  { name: 'Home', href: '/' },
  { name: 'Categories', href: '/categories' },
  { name: 'Compare', href: '/product-comparison' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' }
];

// Add mainMenu to DEFAULT_NAVIGATION as a property
DEFAULT_NAVIGATION.mainMenu = DEFAULT_MAIN_MENU;

/**
 * Site metadata
 */
export const siteConfig = {
  name: 'Recovery Essentials',
  description: 'Your trusted source for recovery equipment reviews and comparisons',
  url: 'https://recovery-essentials.com',
  ogImage: 'https://recovery-essentials.com/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/recoveryessentials',
    github: 'https://github.com/recovery-essentials',
  },
};

/**
 * Currency formatter
 */
export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/**
 * Date formatter
 */
export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
