
import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, StarHalf, CheckCircle, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface Product {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  price: string;
  link: string;
  tags?: string[];
}

interface BandProduct extends Product {
  bestFor?: string;
  type?: string;
  material?: string;
  resistanceLevels?: string;
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

  // Get detailed category intro based on slug
  const getCategoryIntro = (slug: string) => {
    if (slug === 'fitness-bands') {
      return (
        <div className="prose lg:prose-xl">
          <p className="text-lg font-medium text-gray-800 mb-6">
            Resistance bands are one of the most versatile recovery tools available, providing gentle resistance for
            stretching, rehabilitation, and mobility work. They're portable, affordable, and suitable for users of all
            fitness levels. Our team has tested dozens of bands to find the best options for recovery, mobility, and
            injury prevention.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="font-bold text-xl mb-3">Benefits of Resistance Bands for Recovery</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Enhanced Flexibility:</strong> Provides gentle assistance for deeper, more effective stretches</li>
              <li><strong>Improved Circulation:</strong> Promotes blood flow to muscles for faster recovery</li>
              <li><strong>Joint Mobility:</strong> Helps restore range of motion after workouts or injury</li>
              <li><strong>Muscle Activation:</strong> Engages stabilizer muscles that are often overlooked</li>
              <li><strong>Progressive Resistance:</strong> Allows for gradual increase in intensity as recovery progresses</li>
            </ul>
          </div>
        </div>
      );
    }
    return null;
  };

  // Get category-specific comparison table
  const getCategoryComparisonTable = (slug: string, products: BandProduct[]) => {
    if (slug === 'fitness-bands' && products.length > 0) {
      return (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-8">Quick Comparison</h2>

            <div className="overflow-x-auto">
              <Table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <TableHeader>
                  <TableRow className="bg-indigo-100">
                    <TableHead className="py-3 px-4 text-left">Product</TableHead>
                    <TableHead className="py-3 px-4 text-left">Best For</TableHead>
                    <TableHead className="py-3 px-4 text-left">Type</TableHead>
                    <TableHead className="py-3 px-4 text-left">Material</TableHead>
                    <TableHead className="py-3 px-4 text-left">Resistance Levels</TableHead>
                    <TableHead className="py-3 px-4 text-left">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <TableCell className="py-3 px-4 font-medium">{product.name.split(':')[0]}</TableCell>
                      <TableCell className="py-3 px-4">{product.bestFor || 'General Recovery'}</TableCell>
                      <TableCell className="py-3 px-4">{product.type || 'Flat Band'}</TableCell>
                      <TableCell className="py-3 px-4">{product.material || 'Latex'}</TableCell>
                      <TableCell className="py-3 px-4">{product.resistanceLevels || 'Multiple'}</TableCell>
                      <TableCell className="py-3 px-4">{product.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      );
    }
    return null;
  };

  // Get products based on category with extended properties
  const getCategoryProducts = (slug: string): BandProduct[] => {
    if (slug === 'fitness-bands') {
      return [
        {
          id: 1,
          name: "TheraBand Resistance Bands Set",
          image: "https://ext.same-assets.com/2560824938/1799041335.jpeg",
          rating: 4.8,
          reviewCount: 2450,
          description: "The industry standard for rehabilitation and recovery, with multiple resistance levels.",
          price: "$18.95",
          link: "https://www.amazon.com/TheraBand-Resistance-Professional-Physical-Exercise/dp/B01ALPAGTU/",
          tags: ["Professional Quality", "Latex-Free Options"],
          bestFor: "Overall Recovery",
          type: "Flat Band",
          material: "Latex (Latex-free option)",
          resistanceLevels: "Multiple (3-6)"
        },
        {
          id: 2,
          name: "Perform Better Mini Bands",
          image: "https://ext.same-assets.com/590153826/3156167785.jpeg",
          rating: 4.7,
          reviewCount: 1840,
          description: "Continuous loop bands ideal for lower body mobility work and activation exercises.",
          price: "$14.99",
          link: "https://www.amazon.com/Perform-Better-Exercise-Mini-Band/dp/B07C71JC9F/",
          tags: ["Durable Construction", "Set of 4 Intensities"],
          bestFor: "Lower Body",
          type: "Loop Band",
          material: "Rubber",
          resistanceLevels: "4 levels"
        },
        {
          id: 3,
          name: "Rogue Monster Bands",
          image: "https://ext.same-assets.com/1001010132/rogue-bands.jpg",
          rating: 4.9,
          reviewCount: 567,
          description: "Heavy-duty resistance bands for advanced mobility and strength training.",
          price: "$24.99",
          link: "#",
          tags: ["Premium Quality", "Heavy Duty"],
          bestFor: "Advanced Mobility",
          type: "Large Loop",
          material: "Natural Latex",
          resistanceLevels: "7 levels"
        },
        {
          id: 4,
          name: "Fit Simplify Set",
          image: "https://ext.same-assets.com/1001010133/fit-simplify.jpg",
          rating: 4.5,
          reviewCount: 1200,
          description: "Affordable and versatile resistance band set for home use.",
          price: "$10.95",
          link: "#",
          tags: ["Budget Friendly", "Starter Set"],
          bestFor: "Budget Option",
          type: "Loop Band",
          material: "Latex",
          resistanceLevels: "5 levels"
        },
        {
          id: 5,
          name: "SKLZ Pro Bands",
          image: "https://ext.same-assets.com/1001010134/sklz-bands.jpg",
          rating: 4.3,
          reviewCount: 890,
          description: "Tube bands with handles for upper body exercises and rehabilitation.",
          price: "$29.99",
          link: "#",
          tags: ["Handles Included", "Versatile"],
          bestFor: "Upper Body",
          type: "Tube with Handles",
          material: "TPE",
          resistanceLevels: "3 levels"
        }
      ];
    } else {
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
    }
  };

  // Get featured product section for fitness bands
  const getFeaturedProduct = (slug: string, products: BandProduct[]) => {
    if (slug === 'fitness-bands' && products.length > 0) {
      const featuredProduct = products[0]; // Using the first product as featured
      
      return (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-10 text-center">Our Top Pick: {featuredProduct.name}</h2>

            <div className="flex flex-col md:flex-row gap-8 mb-10">
              <div className="md:w-1/2">
                <img src={featuredProduct.image} alt={featuredProduct.name} className="rounded-lg shadow-md w-full" />
              </div>
              <div className="md:w-1/2">
                <div className="product-rating mb-3">
                  <span className="text-xl font-bold">{featuredProduct.rating}/5</span>
                  <span className="ml-2 flex">
                    {renderRating(featuredProduct.rating)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">({featuredProduct.reviewCount.toLocaleString()}+ reviews)</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{featuredProduct.name}</h3>
                <p className="text-gray-800 mb-3 text-lg font-semibold">{featuredProduct.price}</p>
                <div className="mb-5 flex flex-wrap gap-2">
                  {featuredProduct.tags?.map((tag, index) => (
                    <span key={index} className={`inline-block ${index % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'} text-xs px-2 py-1 rounded-full`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  The industry standard for rehabilitation and recovery, TheraBand's professional-grade resistance bands
                  come in multiple resistance levels color-coded for easy identification. Made of high-quality natural
                  rubber latex (with latex-free options available), these bands provide consistent, smooth resistance
                  throughout the entire range of motion.
                </p>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white" 
                  asChild
                >
                  <a href={featuredProduct.link} target="_blank" rel="noopener noreferrer">
                    Check Price on Amazon
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-2xl font-bold mb-4">Why We Love It</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-indigo-600 mb-2"><CheckCircle className="h-6 w-6" /></div>
                  <h4 className="font-bold mb-2">Progressive Resistance</h4>
                  <p className="text-sm text-gray-600">Multiple resistance levels allow you to gradually increase intensity as your recovery progresses.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-indigo-600 mb-2"><CheckCircle className="h-6 w-6" /></div>
                  <h4 className="font-bold mb-2">Clinically Proven</h4>
                  <p className="text-sm text-gray-600">Used by physical therapists and rehabilitation specialists worldwide with proven effectiveness.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-indigo-600 mb-2"><CheckCircle className="h-6 w-6" /></div>
                  <h4 className="font-bold mb-2">Versatile Application</h4>
                  <p className="text-sm text-gray-600">Flat band design makes them ideal for both stretching assistance and resistive exercises.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
    return null;
  };

  // Get video demonstration section for fitness bands
  const getVideoSection = (slug: string) => {
    if (slug === 'fitness-bands') {
      return (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Resistance Band Recovery Techniques</h2>

            <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              Watch this video to learn effective resistance band stretches and mobility exercises that can
              enhance your recovery and improve flexibility:
            </p>

            <div className="relative pb-[56.25%] h-0 rounded-lg shadow-lg overflow-hidden">
              <iframe 
                className="absolute top-0 left-0 w-full h-full" 
                src="https://www.youtube.com/embed/PjZ9w2cQP-Q" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>
      );
    }
    return null;
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
          {categorySlug === 'fitness-bands' && (
            <p className="text-sm bg-indigo-700 inline-block px-3 py-1 rounded-full">
              <Info className="inline mr-1 h-4 w-4" /> Affiliate Disclosure: We may earn commissions from qualifying purchases
            </p>
          )}
        </div>
      </section>

      {/* Category Introduction */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {getCategoryIntro(categorySlug || '')}
        </div>
      </section>

      {/* Featured Product (for fitness bands) */}
      {getFeaturedProduct(categorySlug || '', products as BandProduct[])}

      {/* Products Grid (for other categories) */}
      {categorySlug !== 'fitness-bands' && products.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Top {categoryName}</h2>

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
          </div>
        </section>
      )}

      {/* Video Section (for fitness bands) */}
      {getVideoSection(categorySlug || '')}

      {/* Comparison Table (for fitness bands) */}
      {getCategoryComparisonTable(categorySlug || '', products as BandProduct[])}

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Improve Your Recovery?</h2>
          <p className="text-xl mb-8 text-white max-w-2xl mx-auto">
            Find the perfect {categoryName.toLowerCase()} for your recovery needs and start experiencing improved mobility and faster recovery.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button className="bg-white text-indigo-600 hover:bg-gray-100" asChild>
              <a href={`https://www.amazon.com/s?k=${categorySlug}+for+recovery`} target="_blank" rel="noopener noreferrer">
                Shop on Amazon
              </a>
            </Button>
            <Button className="bg-indigo-700 hover:bg-indigo-800 text-white border border-white" asChild>
              <Link to="/blog">View Recovery Tips</Link>
            </Button>
          </div>
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
