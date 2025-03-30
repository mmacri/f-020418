import { Product } from '@/services/products/types';

// Define a simple Metadata interface to replace the Next.js one
export interface Metadata {
  title?: string;
  description?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: { url: string }[];
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    images?: string[];
    creator?: string;
  };
  icons?: string;
  metadataBase?: URL;
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
}

export const constructMetadata = ({
  title = 'Recovery Essentials - Your Guide to Recovery Products',
  description = 'Your go-to resource for unbiased reviews and expert advice on recovery tools and techniques. Find the best products to help you feel, move, and perform better.',
  image = '/og.png',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata => {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@joshtriedcoding',
    },
    icons,
    metadataBase: new URL('https://recoveryessentials.org'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
};

export const generateProductStructuredData = (product: Product) => {
  // If no product or required fields, return null
  if (!product || !product.name || !product.description || !product.price) {
    return null;
  }
  
  // Convert the price to a proper string (with 2 decimal places)
  const priceString = typeof product.price === 'number' 
    ? product.price.toFixed(2) 
    : parseFloat(String(product.price)).toFixed(2);
  
  // Get product image URL
  const imageUrl = product.imageUrl || (product.images && product.images.length > 0 
    ? (typeof product.images[0] === 'string' 
      ? product.images[0] 
      : (product.images[0] as any).url) 
    : null);
  
  // Convert ISO date format to proper date if available, otherwise use today's date
  const datePublished = (product.createdAt && typeof product.createdAt === 'string') 
    ? new Date(product.createdAt).toISOString()
    : new Date().toISOString();
  
  const dateModified = (product.updatedAt && typeof product.updatedAt === 'string')
    ? new Date(product.updatedAt).toISOString()
    : datePublished;
  
  // Base structured data object
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": imageUrl || "",
    "sku": product.id,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Recovery Essentials"
    },
    "offers": {
      "@type": "Offer",
      "url": `${window.location.origin}/products/${product.slug}`,
      "priceCurrency": "USD",
      "price": priceString,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "aggregateRating": (product.rating && product.reviewCount) ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating.toString(),
      "reviewCount": product.reviewCount.toString()
    } : undefined,
    "datePublished": datePublished,
    "dateModified": dateModified
  };
};

export const generateCategoryStructuredData = (category: any) => {
  if (!category || !category.name || !category.description) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.name,
    "description": category.description,
    "url": `${window.location.origin}/categories/${category.slug}`,
    "image": category.imageUrl || "",
    "keywords": `${category.name}, ${category.name} products, buy ${category.name}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${window.location.origin}/categories/${category.slug}`
    }
  };
};
