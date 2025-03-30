
// Export types
export type { Product, SupabaseProduct } from './types';

// Export mapping functions
export { 
  mapSupabaseProductToProduct, 
  mapProductToSupabaseProduct,
  extractImageUrl
} from './mappers';

// Export API functions
export {
  getProducts,
  getProductById,
  getProductBySlug,
  getProductsByCategory,
  getProductsBySubcategory,
  searchProducts
} from './productApi';

// Export operations functions
export {
  addProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from './productOperations';

// Export mock data functions
export { generateMockProducts } from './mockData';
