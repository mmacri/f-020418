
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { getNavigationCategories } from '@/services/categoryService';
import { getProducts } from '@/services/productService';

// Import home page components
import HomeHero from '@/components/home/HomeHero';
import HomeFeaturedCategories from '@/components/home/HomeFeaturedCategories';
import HomeFeaturedProducts from '@/components/home/HomeFeaturedProducts';
import HomeWhyChooseUs from '@/components/home/HomeWhyChooseUs';
import HomeNewsletter from '@/components/home/HomeNewsletter';
import HomeBestSellers from '@/components/home/HomeBestSellers';
import HomeRecentArticles from '@/components/home/HomeRecentArticles';

const Home = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get categories
        const categoriesData = await getNavigationCategories();
        setCategories(categoriesData);
        
        // Get products
        const products = await getProducts();
        
        // Featured products (products with highest rating)
        const featured = [...products]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
        setFeaturedProducts(featured);
        
        // Best sellers (could be based on other criteria, here using most reviews)
        const bestselling = [...products]
          .sort((a, b) => b.reviewCount - a.reviewCount)
          .slice(0, 6);
        setBestSellers(bestselling);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="py-12 text-center">
          <p className="text-lg text-gray-600">Loading content...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <HomeHero />
      <HomeFeaturedCategories categories={categories} />
      <HomeFeaturedProducts products={featuredProducts} />
      <HomeWhyChooseUs />
      <HomeNewsletter />
      <HomeBestSellers products={bestSellers} />
      <HomeRecentArticles />
    </MainLayout>
  );
};

export default Home;
