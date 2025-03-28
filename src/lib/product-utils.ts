
import { generateAffiliateLink } from './amazon-api';

// Global site configuration
export const SITE_CONFIG = {
  apiEndpoint: '/api',
  defaultCurrency: 'USD',
  currencySymbol: '$',
  siteName: 'Recovery Essentials',
  associateTag: 'recoveryessentials-20',
  imageBasePath: '/images/'
};

/**
 * Format a price with currency symbol
 */
export function formatPrice(price: number, currency = SITE_CONFIG.defaultCurrency) {
  if (typeof price !== 'number') {
    return 'Price unavailable';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(price);
}

/**
 * Calculate discount percentage between original and current price
 */
export function calculateDiscount(originalPrice: number, currentPrice: number) {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) {
    return 0;
  }

  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Truncate text to a certain length with ellipsis
 */
export function truncateText(text: string, length = 100) {
  if (!text || text.length <= length) {
    return text;
  }

  return text.substring(0, length) + '...';
}

/**
 * Create a slug from a string
 */
export function createSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

/**
 * Generate a product URL
 */
export function generateProductUrl(product: { slug: string, category: string }) {
  if (!product || !product.slug) {
    return '#';
  }

  return `/products/${product.category}/${product.slug}`;
}

/**
 * Get category name from slug
 */
export function getCategoryName(categorySlug: string) {
  const categories: Record<string, string> = {
    'massage-guns': 'Massage Guns',
    'foam-rollers': 'Foam Rollers',
    'fitness-bands': 'Resistance Bands',
    'compression-gear': 'Compression Gear'
  };

  return categories[categorySlug] || categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get demo products for testing
 */
export function getDemoProducts() {
  return [
    {
      id: 'p001',
      name: 'Theragun Pro',
      slug: 'theragun-pro',
      category: 'massage-guns',
      description: 'Professional-grade percussive therapy device with advanced features for enhanced recovery.',
      fullDescription: `
        <h3>Professional-Grade Percussion Massage Gun</h3>
        <p>The Theragun Pro is our most advanced percussion device, designed for professionals and serious athletes. With its proprietary brushless motor maintaining top speeds while operating quietly, you'll experience a consistently powerful treatment every time.</p>

        <h3>Key Benefits:</h3>
        <ul>
          <li>Reduces muscle soreness and stiffness</li>
          <li>Improves range of motion</li>
          <li>Enhances circulation and accelerates recovery</li>
          <li>Activates the nervous system and muscles</li>
          <li>Breaks up scar tissue</li>
        </ul>

        <h3>Superior Design</h3>
        <p>The ergonomic multi-grip provides comfort and reduces strain on your hands, wrists, and arms. The Pro includes a rotating arm allowing you to reach 90% of your body by yourself, without straining or compromising proper form.</p>

        <h3>Smart Features</h3>
        <p>Connect to the Therabody app via Bluetooth to access guided treatments and control speed remotely. The Pro features an OLED screen with a force meter that displays how much pressure you're applying during your treatment to help you improve your recovery technique.</p>
      `,
      price: 599.00,
      originalPrice: 649.00,
      brand: 'Therabody',
      sku: 'TGP-2020',
      mpn: 'G4PRO',
      asin: 'B087MJ8VVW',
      rating: 4.7,
      reviewCount: 1254,
      inStock: true,
      features: [
        'Professional-grade percussion therapy device',
        'Rotating arm and ergonomic multi-grip',
        'Reaches 60% deeper into muscle than consumer massagers',
        'Bluetooth connectivity with Therabody app',
        'OLED screen with force meter',
        '5 built-in speeds (1750-2400 PPMs)',
        'Up to 60 lbs of force with no stalling',
        '2 swappable rechargeable batteries (150 min. each)',
        'Customizable speed range',
        'Comes with 6 attachments'
      ],
      specifications: {
        'Speed Range': '1750-2400 PPMs',
        'Percussion Force': 'Up to 60 lbs',
        'Battery Life': '300 minutes total (2 batteries)',
        'Weight': '2.9 lbs',
        'Amplitude': '16mm',
        'Noise Level': '60-65 dB',
        'Warranty': '2-year limited',
        'Attachments': '6 (Dampener, Standard Ball, Wedge, Thumb, Cone, Supersoft)'
      },
      images: [
        { url: 'https://ext.same-assets.com/1001010126/theragun-pro.jpg' },
        { url: 'https://ext.same-assets.com/1001010126/theragun-pro-side.jpg' },
        { url: 'https://ext.same-assets.com/1001010126/theragun-pro-attachments.jpg' },
        { url: 'https://ext.same-assets.com/1001010126/theragun-pro-app.jpg' }
      ]
    },
    {
      id: 'p002',
      name: 'Hyperice Hypervolt 2',
      slug: 'hyperice-hypervolt-2',
      category: 'massage-guns',
      description: 'Bluetooth-enabled percussion massage device with 3 speeds and 5 interchangeable heads.',
      price: 299.00,
      brand: 'Hyperice',
      sku: 'HV2-2021',
      asin: 'B09GFSZXRN',
      rating: 4.5,
      reviewCount: 823,
      inStock: true,
      features: [
        'Quiet Glide™ Technology',
        '3 speed settings',
        'Bluetooth connectivity with Hyperice App',
        'Lightweight design (1.8 lbs)',
        '5 interchangeable head attachments',
        'TSA-approved for carry-on',
        '3 hours of battery life'
      ],
      specifications: {
        'Speed Range': '2000-3200 PPMs',
        'Battery Life': '3 hours',
        'Weight': '1.8 lbs',
        'Noise Level': '54-62 dB',
        'Warranty': '1-year limited'
      },
      images: [
        { url: 'https://ext.same-assets.com/1001010127/hypervolt-2.jpg' }
      ]
    },
    {
      id: 'p003',
      name: 'RENPHO Active Massage Gun',
      slug: 'renpho-active-massage-gun',
      category: 'massage-guns',
      description: 'Affordable percussion massage gun with 20 speed levels and 6 massage heads.',
      price: 99.99,
      originalPrice: 129.99,
      brand: 'RENPHO',
      sku: 'R-MG-A1',
      asin: 'B07YZDJ5FQ',
      rating: 4.3,
      reviewCount: 12892,
      inStock: true,
      features: [
        '20 adjustable speed levels',
        '6 massage heads for different body parts',
        'Super quiet operation (<45dB)',
        'Up to 6 hours of battery life',
        'Auto-shutoff after 10 minutes',
        'Lightweight design (2.1 lbs)'
      ],
      images: [
        { url: 'https://ext.same-assets.com/1001010128/renpho-massage-gun.jpg' }
      ]
    },
    {
      id: 'p004',
      name: 'TriggerPoint GRID Foam Roller',
      slug: 'triggerpoint-grid-foam-roller',
      category: 'foam-rollers',
      description: 'High-quality foam roller with patented multi-density exterior for effective muscle recovery.',
      price: 36.99,
      brand: 'TriggerPoint',
      sku: 'TP-GRID-13',
      asin: 'B0040EGNIU',
      rating: 4.8,
      reviewCount: 18436,
      inStock: true,
      features: [
        'Patented design with multi-density exterior',
        'Distinctive surface pattern for targeted massage',
        'Hollow core maintains shape after repeated use',
        'Supports up to 500 pounds',
        'Compact size (13 inches)'
      ],
      images: [
        { url: 'https://ext.same-assets.com/1001010124/foam-roller.jpg' }
      ]
    },
    {
      id: 'p005',
      name: 'TheraBand Resistance Bands Set',
      slug: 'theraband-resistance-bands-set',
      category: 'fitness-bands',
      description: 'Professional-grade resistance bands for rehabilitation and recovery with multiple resistance levels.',
      price: 18.95,
      brand: 'TheraBand',
      sku: 'TB-RBS-01',
      asin: 'B01ALPAGTU',
      rating: 4.8,
      reviewCount: 2450,
      inStock: true,
      features: [
        'Professional-grade latex material',
        'Multiple resistance levels color-coded for identification',
        'Consistent, smooth resistance throughout range of motion',
        'Latex-free options available',
        'Used by physical therapists worldwide'
      ],
      images: [
        { url: 'https://ext.same-assets.com/2560824938/1799041335.jpeg' }
      ]
    },
    {
      id: 'p006',
      name: 'Perform Better Mini Bands',
      slug: 'perform-better-mini-bands',
      category: 'fitness-bands',
      description: 'Continuous loop bands ideal for lower body mobility work and activation exercises.',
      price: 14.99,
      brand: 'Perform Better',
      sku: 'PB-MB-01',
      asin: 'B07C71JC9F',
      rating: 4.7,
      reviewCount: 1840,
      inStock: true,
      features: [
        'Set of 4 different resistance levels',
        'Perfect for hip and glute activation',
        'Seamless design prevents snapping or rolling',
        'Ideal for warming up muscles before workouts',
        'Durable construction'
      ],
      images: [
        { url: 'https://ext.same-assets.com/590153826/3156167785.jpeg' }
      ]
    },
    {
      id: 'p007',
      name: 'CEP Compression Socks',
      slug: 'cep-compression-socks',
      category: 'compression-gear',
      description: 'Medical-grade graduated compression socks for enhanced circulation and recovery.',
      price: 59.95,
      brand: 'CEP',
      sku: 'CEP-3-0',
      asin: 'B0BL3VTXLZ',
      rating: 4.6,
      reviewCount: 3271,
      inStock: true,
      features: [
        '20-30 mmHg medical-grade compression',
        'Graduated compression profile',
        'Moisture-wicking fabric',
        'Anatomical fit for left and right foot',
        'Microfiber technology for comfort'
      ],
      images: [
        { url: 'https://ext.same-assets.com/1001010129/compression-socks.jpg' }
      ]
    }
  ];
}

/**
 * Get products by category
 */
export function getProductsByCategory(categorySlug: string) {
  const allProducts = getDemoProducts();
  return allProducts.filter(product => product.category === categorySlug);
}

/**
 * Get a specific product by slug
 */
export function getProductBySlug(slug: string) {
  const allProducts = getDemoProducts();
  return allProducts.find(product => product.slug === slug);
}

/**
 * Generate HTML for rating stars
 */
export function generateRatingStars(rating: number) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  const stars = [];
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push('★');
  }
  
  // Add half star if needed
  if (halfStar) {
    stars.push('★½');
  }
  
  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push('☆');
  }
  
  return stars.join('');
}
