
import { Product } from '@/services/productService';

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

/**
 * Generate meta tags for a product
 */
export const generateProductMetaTags = (product: Product): MetaTag[] => {
  const metaTags: MetaTag[] = [
    { name: 'description', content: product.shortDescription || product.description.substring(0, 160) },
    { property: 'og:title', content: product.name },
    { property: 'og:description', content: product.shortDescription || product.description.substring(0, 160) },
    { property: 'og:type', content: 'product' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: product.name },
    { name: 'twitter:description', content: product.shortDescription || product.description.substring(0, 160) },
  ];
  
  // Add image if available
  if (product.images && product.images.length > 0) {
    metaTags.push({ property: 'og:image', content: product.images[0] });
    metaTags.push({ name: 'twitter:image', content: product.images[0] });
  }
  
  // Add price
  if (product.price) {
    metaTags.push({ property: 'product:price:amount', content: product.price.toString() });
    metaTags.push({ property: 'product:price:currency', content: 'USD' });
  }
  
  return metaTags;
};

/**
 * Generate JSON-LD structured data for a product
 */
export const generateProductJsonLd = (product: Product): string => {
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images && product.images.length > 0 ? product.images[0] : undefined,
    sku: product.id.toString(),
    mpn: product.asin || product.id.toString(),
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Unknown'
    },
    offers: {
      '@type': 'Offer',
      url: window.location.href,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Recovery Essentials'
      }
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount
    } : undefined
  };
  
  return JSON.stringify(structuredData);
};

/**
 * Generate a basic sitemap XML string
 */
export const generateSitemapXml = async (
  baseUrl: string,
  products: Product[]
): Promise<string> => {
  const now = new Date().toISOString();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/categories</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  
  // Add product URLs
  products.forEach(product => {
    sitemap += `
  <url>
    <loc>${baseUrl}/products/${product.slug}</loc>
    <lastmod>${product.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });
  
  sitemap += `
</urlset>`;
  
  return sitemap;
};

/**
 * Helper to set metadata tags in document head
 */
export const setMetaTags = (tags: MetaTag[]): void => {
  // Remove any existing meta tags
  document.querySelectorAll('meta[data-dynamic="true"]').forEach(tag => tag.remove());
  
  // Add new meta tags
  tags.forEach(tag => {
    const meta = document.createElement('meta');
    meta.dataset.dynamic = 'true';
    
    if (tag.name) meta.setAttribute('name', tag.name);
    if (tag.property) meta.setAttribute('property', tag.property);
    
    meta.setAttribute('content', tag.content);
    document.head.appendChild(meta);
  });
};

/**
 * Helper to set JSON-LD structured data in document head
 */
export const setJsonLd = (jsonLd: string): void => {
  // Remove any existing JSON-LD scripts
  document.querySelectorAll('script[type="application/ld+json"]').forEach(script => script.remove());
  
  // Add new JSON-LD script
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = jsonLd;
  document.head.appendChild(script);
};
