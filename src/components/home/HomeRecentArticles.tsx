
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { localStorageKeys } from '@/lib/constants';

const DEFAULT_HERO_IMAGE = "https://ext.same-assets.com/1001010126/massage-gun-category.jpg";
const LOCAL_FALLBACK_IMAGE = "/placeholder.svg";

const HomeRecentArticles: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Recovery Tips & Advice</h2>
          <Link to="/blog" className="text-indigo-600 font-medium flex items-center">
            View All Articles
            <ChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img 
              src="https://ext.same-assets.com/30303031/foam-roller-category.jpg" 
              alt="Foam Rolling" 
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const useLocalFallback = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
                target.src = useLocalFallback ? LOCAL_FALLBACK_IMAGE : DEFAULT_HERO_IMAGE;
              }}
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">5 Foam Rolling Techniques for Lower Back Pain</h3>
              <p className="text-gray-600 mb-4">
                Learn how to effectively use a foam roller to relieve lower back tension and pain.
              </p>
              <Link to="/blog/foam-rolling-techniques" className="text-indigo-600 font-medium flex items-center">
                Read More
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img 
              src="https://ext.same-assets.com/1001010126/massage-gun-category.jpg" 
              alt="Massage Gun" 
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const useLocalFallback = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
                target.src = useLocalFallback ? LOCAL_FALLBACK_IMAGE : DEFAULT_HERO_IMAGE;
              }}
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Massage Gun vs. Foam Roller: Which Is Better?</h3>
              <p className="text-gray-600 mb-4">
                Compare the benefits and differences between these popular recovery tools.
              </p>
              <Link to="/blog/massage-gun-vs-foam-roller" className="text-indigo-600 font-medium flex items-center">
                Read More
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img 
              src="https://ext.same-assets.com/30303032/compression-category.jpg" 
              alt="Compression Recovery" 
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const useLocalFallback = localStorage.getItem(localStorageKeys.USE_LOCAL_FALLBACKS) === 'true';
                target.src = useLocalFallback ? LOCAL_FALLBACK_IMAGE : DEFAULT_HERO_IMAGE;
              }}
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">The Science of Compression for Recovery</h3>
              <p className="text-gray-600 mb-4">
                Understand how compression gear works and its proven benefits for athletes.
              </p>
              <Link to="/blog/compression-recovery-science" className="text-indigo-600 font-medium flex items-center">
                Read More
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeRecentArticles;
