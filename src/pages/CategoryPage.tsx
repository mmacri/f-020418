
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import CategoryHero from '@/components/CategoryHero';
import SubcategoryHero from '@/components/SubcategoryHero';
import { getCategoryBySlug } from '@/services/categoryService';
import { getProductsByCategory } from '@/lib/product-utils';
import { generateCategoryBreadcrumbs } from '@/lib/category-utils';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!categorySlug) return;
      
      setIsLoading(true);
      try {
        // Get category data
        const data = await getCategoryBySlug(categorySlug);
        setCategoryData(data);
        
        if (data) {
          // Generate breadcrumbs
          const crumbs = generateCategoryBreadcrumbs(data);
          setBreadcrumbs(crumbs);
          
          // Get products for this category
          const categoryProducts = await getProductsByCategory(categorySlug);
          setProducts(categoryProducts);
        }
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [categorySlug]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading category information...</p>
        </div>
      </MainLayout>
    );
  }

  if (!categoryData) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <p className="mt-2">The category you're looking for doesn't exist.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-2">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>
      
      {/* Category Hero */}
      <CategoryHero 
        name={categoryData.name}
        description={categoryData.description}
        backgroundImage={categoryData.imageUrl}
        subcategories={categoryData.subcategories || []}
        category={categoryData}
      />
      
      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {categoryData.name} Products
          </h2>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default CategoryPage;
