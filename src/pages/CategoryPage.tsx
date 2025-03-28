
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  
  // Convert slug to display name
  const getCategoryName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{getCategoryName(categorySlug || '')}</h1>
        <p className="text-gray-600 mb-8">
          Discover the best {getCategoryName(categorySlug || '')} for your recovery needs. 
          Our expert reviews and recommendations will help you find the perfect products.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">About {getCategoryName(categorySlug || '')}</h2>
          <p className="text-gray-700">
            This category page is currently under development. We'll soon add detailed product reviews, 
            buying guides, and recommendations for {getCategoryName(categorySlug || '')}.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
