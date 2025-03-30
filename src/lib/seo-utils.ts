
import { Product } from '@/services/productService';
import { BlogPost } from '@/services/blogService';
import { extractImageUrl } from '@/lib/images/productImageUtils';

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
    const imageUrl = extractImageUrl(product.images[0]);
    metaTags.push({ property: 'og:image', content: imageUrl });
    metaTags.push({ name: 'twitter:image', content: imageUrl });
  }
  
  // Add price
  if (product.price) {
    metaTags.push({ property: 'product:price:amount', content: product.price.toString() });
    metaTags.push({ property: 'product:price:currency', content: 'USD' });
  }
  
  return metaTags;
};

/**
 * Generate meta tags for a blog post
 */
export const generateBlogPostMetaTags = (post: BlogPost): MetaTag[] => {
  const metaTags: MetaTag[] = [
    { name: 'description', content: post.seoDescription || post.excerpt.substring(0, 160) },
    { property: 'og:title', content: post.seoTitle || post.title },
    { property: 'og:description', content: post.seoDescription || post.excerpt.substring(0, 160) },
    { property: 'og:type', content: 'article' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: post.seoTitle || post.title },
    { name: 'twitter:description', content: post.seoDescription || post.excerpt.substring(0, 160) },
  ];
  
  // Add image if available
  if (post.coverImage) {
    metaTags.push({ property: 'og:image', content: post.coverImage });
    metaTags.push({ name: 'twitter:image', content: post.coverImage });
  } else if (post.image) {
    metaTags.push({ property: 'og:image', content: post.image });
    metaTags.push({ name: 'twitter:image', content: post.image });
  }
  
  // Add keywords if available
  if (post.seoKeywords && post.seoKeywords.length > 0) {
    metaTags.push({ name: 'keywords', content: post.seoKeywords.join(', ') });
  } else if (post.tags && post.tags.length > 0) {
    metaTags.push({ name: 'keywords', content: post.tags.join(', ') });
  }
  
  // Add article specific meta tags
  metaTags.push({ property: 'article:published_time', content: post.createdAt });
  metaTags.push({ property: 'article:modified_time', content: post.updatedAt });
  metaTags.push({ property: 'article:section', content: post.category });
  
  if (post.tags) {
    post.tags.forEach(tag => {
      metaTags.push({ property: 'article:tag', content: tag });
    });
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
    image: product.images && product.images.length > 0 ? extractImageUrl(product.images[0]) : undefined,
    sku: String(product.id),
    mpn: product.asin || String(product.id),
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
 * Generate JSON-LD structured data for a blog post
 */
export const generateBlogPostJsonLd = (post: BlogPost): string => {
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || post.image,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author || 'Admin'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Recovery Essentials',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/logo.png` // Assuming you have a logo.png
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': window.location.href
    },
    keywords: post.seoKeywords || post.tags || []
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
