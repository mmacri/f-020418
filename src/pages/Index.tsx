
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { getNavigationCategories } from '@/services/categoryService';
import { getFeaturedProducts } from '@/lib/products/queries/featuredProducts';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogPostsSection from '@/components/home/BlogPostsSection';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/services/products/types';
import { localStorageKeys, imageUrls } from '@/lib/constants';

const Index = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState<string>(imageUrls.HERO_DEFAULT);
  
  // Immediately load the hero image
  useEffect(() => {
    const savedImage = localStorage.getItem(localStorageKeys.HERO_IMAGE);
    if (savedImage) {
      setHeroImage(savedImage);
    }
    
    // Listen for hero image updates
    const handleHeroImageUpdate = (e: CustomEvent) => {
      if (e.detail && e.detail.imageUrl) {
        setHeroImage(e.detail.imageUrl);
      }
    };
    
    window.addEventListener('heroImageUpdated', handleHeroImageUpdate as EventListener);
    
    return () => {
      window.removeEventListener('heroImageUpdated', handleHeroImageUpdate as EventListener);
    };
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get categories with subcategories
        const categoriesData = await getNavigationCategories();
        setCategories(categoriesData.filter(cat => cat.showInNavigation !== false));
        
        // Get featured products
        const featuredData = await getFeaturedProducts(6); // Limit to 6 products
        setFeaturedProducts(featuredData);
        
        // Track homepage view for analytics
        try {
          const { data: analyticsData } = await supabase
            .from('analytics_events')
            .insert({
              event_type: 'home_page_view',
              page_url: window.location.href,
              data: {
                timestamp: Date.now()
              }
            })
            .select();
        } catch (analyticsError) {
          console.error('Error tracking homepage view:', analyticsError);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <MainLayout>
      <HeroSection 
        buttonText="Shop All Categories" 
        buttonLink="/categories" 
        heroImageUrl={heroImage}
      />
      <CategoriesSection categories={categories} />
      <FeaturedProductsSection 
        products={featuredProducts} 
        title="Featured Recovery Products"
        subtitle="Our handpicked selection of the best recovery tools to help you feel better, move better, and perform better."
        viewAllLink="/products"
        viewAllText="View All Products"
        maxProducts={6}
      />
      <WhyChooseUsSection />
      <NewsletterSection />
      <TestimonialsSection />
      <BlogPostsSection />
    </MainLayout>
  );
};

export default Index;
