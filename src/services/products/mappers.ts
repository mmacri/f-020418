
import { SupabaseProduct, Product } from './types';

export const mapSupabaseProductToProduct = (product: any): Product => {
  if (!product) {
    console.error('Received null or undefined product in mapSupabaseProductToProduct');
    return {
      id: 'default',
      slug: 'default',
      name: 'Product Not Available',
      description: '',
      price: 0,
      rating: 0,
      reviewCount: 0,
      imageUrl: '',
      inStock: false,
      category: '',
    };
  }
  
  try {
    // Safely parse attributes - don't use recursion or deep type inference
    let attributes = {};
    if (product.attributes) {
      if (typeof product.attributes === 'string') {
        try {
          attributes = JSON.parse(product.attributes);
        } catch (e) {
          console.error('Error parsing attributes string:', e);
        }
      } else {
        attributes = product.attributes;
      }
    }
    
    // Safely parse specifications - don't use recursion or deep type inference
    let specifications = {};
    if (product.specifications) {
      if (typeof product.specifications === 'string') {
        try {
          specifications = JSON.parse(product.specifications);
        } catch (e) {
          console.error('Error parsing specifications string:', e);
        }
      } else {
        specifications = product.specifications;
      }
    }
    
    const productId = product.id ? product.id : 'unknown';
    
    return {
      id: productId,
      slug: product.slug || 'unknown',
      name: product.name || 'Unnamed Product',
      description: product.description || '',
      price: product.price || 0,
      originalPrice: product.sale_price || undefined,
      rating: product.rating || 0,
      reviewCount: attributes.reviewCount || 0,
      imageUrl: product.image_url || '',
      images: product.image_url ? [product.image_url] : [],
      inStock: product.in_stock !== false, // Default to true unless explicitly false
      category: attributes.category || '',
      categoryId: product.category_id,
      subcategory: attributes.subcategory || '',
      specifications: specifications,
      specs: specifications,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      features: Array.isArray(attributes.features) ? attributes.features : [],
      bestSeller: !!attributes.bestSeller,
      brand: attributes.brand || '',
      pros: Array.isArray(attributes.pros) ? attributes.pros : []
    };
  } catch (error) {
    console.error('Error mapping product:', error, product);
    return {
      id: product.id || 'error',
      slug: product.slug || 'error',
      name: product.name || 'Error Mapping Product',
      description: 'There was an error processing this product data.',
      price: 0,
      rating: 0,
      reviewCount: 0,
      imageUrl: '',
      inStock: false,
      category: '',
    };
  }
};

export const mapProductToSupabaseProduct = (product: Partial<Product>) => {
  return {
    id: product.id?.toString(),
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    sale_price: product.originalPrice,
    rating: product.rating,
    image_url: product.imageUrl || (product.images && product.images.length > 0 ? 
      typeof product.images[0] === 'string' ? product.images[0] : (product.images[0] as { url: string }).url : ''),
    in_stock: product.inStock,
    category_id: product.categoryId?.toString(),
    specifications: product.specifications || product.specs,
    attributes: {
      reviewCount: product.reviewCount,
      features: product.features,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      bestSeller: product.bestSeller,
      pros: product.pros
    }
  };
};

export const extractImageUrl = (image: string | { url: string } | undefined): string => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url;
};
