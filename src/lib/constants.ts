
export const localStorageKeys = {
  USER: "recovery-essentials-user",
  USERS: "recovery-essentials-users",
  PRODUCTS: "recovery-essentials-products",
  BLOG_POSTS: "recovery-essentials-blog-posts",
  CATEGORIES: "recovery-essentials-categories",
  CATEGORIES_CONTENT: "recovery-essentials-categories-content",
  WISHLIST: "recovery-essentials-wishlist",
  THEME: "recovery-essentials-theme",
  CART: "recovery-essentials-cart",
  AFFILIATE_CLICKS: "recovery-essentials-affiliate-clicks", // Track affiliate link interactions
  NAVIGATION: "recovery-essentials-navigation", // Store navigation structure
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
