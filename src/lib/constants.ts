
export const localStorageKeys = {
  PRODUCTS: "products",
  CART: "cart",
  WISHLIST: "wishlist",
  COMPARE: "compare",
  USER: "user",
  AUTH_TOKEN: "authToken",
  HERO_IMAGE: "heroImage",
  USE_LOCAL_FALLBACKS: "useLocalFallbacks",
  WISHLIST_ITEMS: "wishlistItems",
  COMPARISON_PRODUCTS: "comparisonProducts",
  AFFILIATE_CLICKS: "affiliateClicks",
  ANALYTICS_DATA: "analyticsData",
  USER_ID: "userId",
  BLOG_POSTS: "blogPosts",
  CATEGORY_CONTENT: "categoryContent"
};

export const currency = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export const appName = "Recovery Essentials";

export const defaultMeta = {
  title: appName + " - Your Source for Recovery",
  description:
    "Find the best recovery tools and equipment to help you recover faster and perform better.",
  keywords:
    "recovery, tools, equipment, massage, foam roller, compression, ice bath",
  author: "Recovery Essentials",
  siteUrl: "https://recovery-essentials.com",
  twitterHandle: "@RecoveryEsntl",
  ogImage: "https://recovery-essentials.com/og.png",
};

export const imageUrls = {
  PLACEHOLDER: '/placeholder.svg',
  PRODUCT_DEFAULT: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1399&auto=format&fit=crop',
  CATEGORY_DEFAULT: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1470&auto=format&fit=crop',
  BLOG_DEFAULT: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1470&auto=format&fit=crop',
  AVATAR_DEFAULT: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1631&auto=format&fit=crop',
  BRAND_LOGO: '/logo.png',
  HERO_DEFAULT: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1375&auto=format&fit=crop',
  DEFAULT_FALLBACK: '/placeholder.svg'
};

// Default navigation items for the header
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
      title: "Products",
      type: "category-dropdown",
      showInHeader: true,
      items: []
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
      showInHeader: true
    }
  ]
};
