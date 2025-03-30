
// This file is kept for backward compatibility
// It re-exports everything from the new modular structure
export * from './products';

// Make sure searchProducts is explicitly exported
export { searchProducts } from './products/index';
