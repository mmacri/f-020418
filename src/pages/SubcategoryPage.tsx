
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import SubcategoryHero from '@/components/SubcategoryHero';
import { getSubcategoryBySlug } from '@/services/categoryService';
import { getProductsByCategory } from '@/lib/product-utils';
import { generateCategoryBreadcrumbs } from '@/lib/category-utils';
import { Breadcrumbs } from '@/components/product';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';

const SubcategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams<{ categorySlug: string; subcategorySlug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [subcategoryData, setSubcategoryData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!categorySlug || !subcategorySlug) return;
      
      setIsLoading(true);
      try {
        // Get subcategory data
        const data = await getSubcategoryBySlug(categorySlug, subcategorySlug);
        setSubcategoryData(data);
        
        if (data) {
          // Generate breadcrumbs
          const crumbs = generateCategoryBreadcrumbs(data.category, data.subcategory);
          setBreadcrumbs(crumbs);
          
          // Get products for this subcategory
          const subcategoryProducts = await getProductsByCategory(categorySlug, subcategorySlug);
          setProducts(subcategoryProducts);
        }
      } catch (error) {
        console.error('Error loading subcategory data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [categorySlug, subcategorySlug]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading subcategory information...</p>
        </div>
      </MainLayout>
    );
  }

  if (!subcategoryData) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Subcategory not found</h1>
          <p className="mt-2">The subcategory you're looking for doesn't exist.</p>
        </div>
      </MainLayout>
    );
  }

  const { category, subcategory } = subcategoryData;

  return (
    <MainLayout>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-2">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>
      
      {/* Subcategory Hero */}
      <SubcategoryHero 
        categoryName={category.name}
        subcategoryName={subcategory.name}
        description={subcategory.description}
        backgroundImage={subcategory.imageUrl}
        subcategory={subcategory}
      />
      
      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {subcategory.name} Products
          </h2>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found in this subcategory.</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default SubcategoryPage;
