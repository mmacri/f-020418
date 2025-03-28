
import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, StarHalf } from "lucide-react";

interface Product {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  price: string;
  link: string;
}

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  
  // Convert slug to display name
  const getCategoryName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get category description based on slug
  const getCategoryDescription = (slug: string) => {
    const descriptions: Record<string, string> = {
      'massage-guns': 'Percussive therapy devices to target sore muscles and accelerate recovery',
      'foam-rollers': 'Self-myofascial release tools to release muscle tension and improve mobility',
      'fitness-bands': 'High-quality resistance bands for improved mobility, strength and recovery',
      'compression-gear': 'High-quality compression clothing for improved circulation and faster recovery'
    };
    
    return descriptions[slug] || 'Discover the best recovery products for your fitness needs.';
  };

  // Get products based on category
  const getCategoryProducts = (slug: string): Product[] => {
    const productsByCategory: Record<string, Product[]> = {
      'massage-guns': [
        {
          id: 1,
          name: "Theragun Pro",
          image: "https://ext.same-assets.com/1001010126/theragun-pro.jpg",
          rating: 4.5,
          reviewCount: 245,
          description: "Professional-grade percussive therapy device with 60lbs of force and smart app integration.",
          price: "$599.00",
          link: "#"
        },
        {
          id: 2,
          name: "Hyperice Hypervolt 2",
          image: "https://ext.same-assets.com/1001010127/hypervolt-2.jpg",
          rating: 4.0,
          reviewCount: 187,
          description: "Bluetooth-enabled percussion massage device with 3 speeds and 5 interchangeable heads.",
          price: "$299.00",
          link: "#"
        },
        {
          id: 3,
          name: "RENPHO Massage Gun",
          image: "https://ext.same-assets.com/1001010128/renpho-massage-gun.jpg",
          rating: 4.3,
          reviewCount: 1245,
          description: "Affordable percussion massage gun with 20 speed levels and 6 massage heads.",
          price: "$99.99",
          link: "#"
        }
      ],
      'compression-gear': [
        {
          id: 1,
          name: "CEP Compression Socks",
          image: "https://ext.same-assets.com/1001010129/compression-socks.jpg",
          rating: 5.0,
          reviewCount: 189,
          description: "Medical-grade compression socks for improved circulation and reduced muscle fatigue.",
          price: "$59.95",
          link: "#"
        },
        {
          id: 2,
          name: "2XU Compression Sleeves",
          image: "https://ext.same-assets.com/1001010130/compression-sleeves.jpg",
          rating: 4.1,
          reviewCount: 156,
          description: "Calf compression sleeves to enhance performance and speed up recovery.",
          price: "$44.99",
          link: "#"
        },
        {
          id: 3,
          name: "Under Armour Compression Tights",
          image: "https://ext.same-assets.com/1001010131/compression-tights.jpg",
          rating: 4.7,
          reviewCount: 432,
          description: "Full-length compression tights with moisture-wicking technology and 4-way stretch.",
          price: "$79.99",
          link: "#"
        }
      ],
      'fitness-bands': [
        {
          id: 1,
          name: "TheraBand Resistance Bands Set",
          image: "https://ext.same-assets.com/2560824938/1799041335.jpeg",
          rating: 4.8,
          reviewCount: 2450,
          description: "The industry standard for rehabilitation and recovery, with multiple resistance levels.",
          price: "$18.95",
          link: "#"
        },
        {
          id: 2,
          name: "Perform Better Mini Bands",
          image: "https://ext.same-assets.com/590153826/3156167785.jpeg",
          rating: 4.7,
          reviewCount: 1840,
          description: "Continuous loop bands ideal for lower body mobility work and activation exercises.",
          price: "$14.99",
          link: "#"
        },
        {
          id: 3,
          name: "Rogue Monster Bands",
          image: "https://ext.same-assets.com/1001010132/rogue-bands.jpg",
          rating: 4.9,
          reviewCount: 567,
          description: "Heavy-duty resistance bands for advanced mobility and strength training.",
          price: "$24.99",
          link: "#"
        }
      ],
      'foam-rollers': [
        {
          id: 1,
          name: "TriggerPoint GRID Foam Roller",
          image: "https://ext.same-assets.com/30303031/foam-roller-category.jpg",
          rating: 4.6,
          reviewCount: 3245,
          description: "Multi-density foam roller with patented design for effective muscle recovery.",
          price: "$34.99",
          link: "#"
        },
        {
          id: 2,
          name: "Rumble Roller Deep Tissue",
          image: "https://ext.same-assets.com/30303032/rumble-roller.jpg",
          rating: 4.4,
          reviewCount: 1290,
          description: "Aggressive foam roller with firm bumps to target deep tissue massage.",
          price: "$44.95",
          link: "#"
        },
        {
          id: 3,
          name: "LuxFit Premium Foam Roller",
          image: "https://ext.same-assets.com/30303033/luxfit-roller.jpg",
          rating: 4.2,
          reviewCount: 2760,
          description: "High-density foam roller for muscle recovery and physical therapy.",
          price: "$24.95",
          link: "#"
        }
      ]
    };
    
    return productsByCategory[slug] || [];
  };

  // Render star ratings
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-amber-400 text-amber-400" size={16} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-amber-400 text-amber-400" size={16} />);
    }
    
    return stars;
  };

  const products = getCategoryProducts(categorySlug || '');
  const categoryName = getCategoryName(categorySlug || '');
  const categoryDescription = getCategoryDescription(categorySlug || '');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Category Hero Section */}
      <section className="hero-bg text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryName}</h1>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            {categoryDescription}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Top {categoryName}</h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                  <div className="h-56 bg-gray-200">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-amber-400">
                        {renderRating(product.rating)}
                      </div>
                      <span className="ml-2 text-gray-600 text-sm">{product.rating} ({product.reviewCount} reviews)</span>
                    </div>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-indigo-600">{product.price}</span>
                      <Button 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white" 
                        asChild
                      >
                        <Link to={product.link}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <h3 className="text-xl font-semibold mb-4">
                Products for {categoryName} are coming soon!
              </h3>
              <p className="text-gray-600 mb-6">
                We're currently working on compiling the best {categoryName.toLowerCase()} for your recovery needs.
                Check back soon for our expert reviews and recommendations.
              </p>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-indigo-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated on the Latest {categoryName}</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive product recommendations, reviews, and recovery tips.
          </p>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8" 
            asChild
          >
            <Link to="/newsletter">Subscribe to Our Newsletter</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryPage;
