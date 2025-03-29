export const localStorageKeys = {
  PRODUCTS: 'recovery-essentials-products',
  CATEGORIES: 'recovery-essentials-categories',
  USER: 'recovery-essentials-user',
  USER_ID: 'recovery-essentials-user-id',
  AUTH_TOKEN: 'recovery-essentials-auth-token',
  CART_ITEMS: 'recovery-essentials-cart-items',
  WISHLIST_ITEMS: 'recovery-essentials-wishlist',
  BLOG_POSTS: 'recovery-essentials-blog-posts',
  THEME: 'recovery-essentials-theme',
  SETTINGS: 'recovery-essentials-settings',
  AFFILIATE_CLICKS: 'recovery-essentials-affiliate-clicks',
  ANALYTICS_DATA: 'recovery-essentials-analytics-data',
  CATEGORY_CONTENT: 'recovery-essentials-category-content',
  HERO_IMAGE: "recovery_essentials_hero_image"
};

// Default category slugs for the application
export const DEFAULT_CATEGORIES = [
  'massage-guns',
  'foam-rollers',
  'compression-gear',
  'resistance-bands',
  'recovery-tech'
];

// Default navigation structure
export const DEFAULT_NAVIGATION = {
  mainMenu: [
    {
      id: 1,
      title: "Products",
      type: "category-dropdown",
      showInHeader: true,
      items: [] // Will be populated from categories dynamically
    },
    {
      id: 2,
      title: "Blog",
      type: "link",
      url: "/blog",
      showInHeader: true
    },
    {
      id: 3,
      title: "About",
      type: "link",
      url: "/about",
      showInHeader: true
    }
  ],
  footerMenu: [
    {
      id: 4,
      title: "Company",
      type: "section",
      items: [
        { id: 5, title: "About Us", url: "/about", type: "link" },
        { id: 6, title: "Contact", url: "/contact", type: "link" },
        { id: 7, title: "Terms", url: "/terms", type: "link" }
      ]
    },
    {
      id: 8,
      title: "Resources",
      type: "section",
      items: [
        { id: 9, title: "Blog", url: "/blog", type: "link" },
        { id: 10, title: "Affiliate Disclosure", url: "/affiliate-disclosure", type: "link" }
      ]
    }
  ]
};
