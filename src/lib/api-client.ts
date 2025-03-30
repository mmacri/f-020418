// Assuming the location of the string/number comparison is in a function like this:
export const getCategoryProducts = async (categoryId: string) => {
  try {
    const products = await fetchProducts();
    // Convert string categoryId to number for comparison or vice versa
    return products.filter(product => product.categoryId === parseInt(categoryId));
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    return [];
  }
};
