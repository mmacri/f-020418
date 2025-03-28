
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover the Best Recovery Products</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Expert reviews and recommendations for massage guns, foam rollers, and more to help you recover faster and perform better.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#popular-products" className="bg-white text-indigo-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-md">
              Explore Products
            </a>
            <Link to="/blog" className="bg-indigo-700 hover:bg-indigo-800 text-white font-medium py-3 px-6 rounded-md">
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-white" id="popular-products">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Category Card 1 */}
            <CategoryCard 
              title="Massage Guns"
              description="Percussive therapy devices to target sore muscles and speed up recovery."
              imageSrc="https://ext.same-assets.com/1001010123/massage-gun.jpg"
              link="/categories/massage-guns"
            />

            {/* Category Card 2 */}
            <CategoryCard 
              title="Foam Rollers"
              description="Self-myofascial release tools to improve mobility and reduce muscle tension."
              imageSrc="https://ext.same-assets.com/1001010124/foam-roller.jpg"
              link="/categories/foam-rollers"
            />

            {/* Category Card 3 */}
            <CategoryCard 
              title="Compression Gear"
              description="High-quality compression clothing for improved circulation and faster recovery."
              imageSrc="https://ext.same-assets.com/1001010129/compression-socks.jpg"
              link="/categories/compression-gear"
            />

            {/* Category Card 4 */}
            <CategoryCard 
              title="Fitness Bands"
              description="Resistance bands for strength training, mobility work, and injury prevention."
              imageSrc="https://ext.same-assets.com/1001010125/fitness-bands.jpg"
              link="/categories/fitness-bands"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

interface CategoryCardProps {
  title: string;
  description: string;
  imageSrc: string;
  link: string;
}

const CategoryCard = ({ title, description, imageSrc, link }: CategoryCardProps) => {
  return (
    <Card className="bg-gray-50 shadow overflow-hidden">
      <div className="relative h-48">
        <AspectRatio ratio={16/9}>
          <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        </AspectRatio>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link to={link} className="text-indigo-600 hover:text-indigo-800 font-medium">
          Explore <span aria-hidden="true">→</span>
        </Link>
      </CardContent>
    </Card>
  );
};

export default Index;
