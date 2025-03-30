
import React, { useState, useEffect } from 'react';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  Product 
} from '@/services/productService';
import { getNavigationCategories } from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';
import ProductsHeader from './ProductsHeader';
import ProductsTable from './ProductsTable';
import ProductsLoadingState from './ProductsLoadingState';
import EmptyProductsState from './EmptyProductsState';
import ProductForm from './ProductForm';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingProduct?.categoryId) {
      const category = categories.find(cat => String(cat.id) === String(editingProduct.categoryId));
      if (category) {
        setSubcategories(category.subcategories || []);
      } else {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  }, [editingProduct?.categoryId, categories]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getNavigationCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleSubmitProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast({
          title: 'Success',
          description: `Product "${productData.name}" has been updated.`,
        });
      } else {
        await createProduct(productData);
        toast({
          title: 'Success',
          description: `Product "${productData.name}" has been created.`,
        });
      }
      
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product. Please try again.',
        variant: 'destructive',
      });
      throw error; // Re-throw so the form can handle it
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      try {
        await deleteProduct(product.id);
        toast({
          title: 'Success',
          description: `Product "${product.name}" has been deleted.`,
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete product. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <ProductsHeader 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        onCreateProduct={handleCreateProduct} 
      />

      {isLoading ? (
        <ProductsLoadingState />
      ) : filteredProducts.length === 0 ? (
        <EmptyProductsState 
          searchTerm={searchTerm} 
          onCreateProduct={handleCreateProduct} 
        />
      ) : (
        <ProductsTable 
          products={filteredProducts} 
          onEdit={handleEditProduct} 
          onDelete={handleDeleteProduct} 
        />
      )}

      <ProductForm 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        editingProduct={editingProduct} 
        onSubmit={handleSubmitProduct}
        categories={categories}
        subcategories={subcategories}
      />
    </div>
  );
};

export default AdminProducts;
