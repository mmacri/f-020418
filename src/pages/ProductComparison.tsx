
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProductComparison = () => {
  const comparisons = [
    {
      category: "Massage Guns",
      products: [
        {
          name: "Theragun Pro",
          price: "$599",
          rating: 4.8,
          pros: ["Powerful motor", "Long battery life", "Ergonomic design", "Excellent app integration"],
          cons: ["Expensive", "Somewhat loud"],
          bestFor: "Serious athletes and professionals",
          image: "https://ext.same-assets.com/30303030/massage-gun-category.jpg"
        },
        {
          name: "Hypervolt 2 Pro",
          price: "$399",
          rating: 4.7,
          pros: ["Quiet operation", "5 speed settings", "Good battery life", "Bluetooth connectivity"],
          cons: ["Less ergonomic than Theragun", "Heavier than some competitors"],
          bestFor: "Fitness enthusiasts who need quieter operation",
          image: "https://ext.same-assets.com/30303030/massage-gun-category.jpg"
        },
        {
          name: "Bob and Brad Q2 Mini",
          price: "$89",
          rating: 4.4,
          pros: ["Very affordable", "Lightweight and portable", "Surprisingly powerful", "USB-C charging"],
          cons: ["Shorter battery life", "Fewer attachments", "Less durable"],
          bestFor: "Budget-conscious buyers and beginners",
          image: "https://ext.same-assets.com/30303030/massage-gun-category.jpg"
        }
      ]
    },
    {
      category: "Foam Rollers",
      products: [
        {
          name: "TriggerPoint GRID",
          price: "$35",
          rating: 4.7,
          pros: ["Durable construction", "Multi-density surface", "Good size for most users", "Includes free online instructional videos"],
          cons: ["Firmer than some users prefer", "More expensive than basic foam rollers"],
          bestFor: "Most users, from beginners to advanced",
          image: "https://ext.same-assets.com/30303031/foam-roller-category.jpg"
        },
        {
          name: "LuxFit Premium High Density",
          price: "$15",
          rating: 4.5,
          pros: ["Very affordable", "Simple, effective design", "Multiple size options", "Lightweight"],
          cons: ["Less durability than premium options", "Basic design without texture"],
          bestFor: "Beginners and occasional users",
          image: "https://ext.same-assets.com/30303031/foam-roller-category.jpg"
        },
        {
          name: "Hyperice Vyper 3",
          price: "$199",
          rating: 4.6,
          pros: ["Vibration technology", "Three vibration settings", "Rechargeable battery", "TSA approved for carry-on"],
          cons: ["Expensive", "Heavier than non-vibrating rollers", "Short battery life at highest setting"],
          bestFor: "Elite athletes and those with specific recovery needs",
          image: "https://ext.same-assets.com/30303031/foam-roller-category.jpg"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Product Comparisons</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Compare the best recovery products side-by-side to find the perfect fit for your needs and budget.
          </p>
        </div>
      </section>

      {/* Comparison Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {comparisons.map((comparison, index) => (
            <div key={index} className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">{comparison.category} Comparison</h2>
              
              {/* Desktop/Tablet Comparison Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b-2 border-gray-200 bg-gray-50 p-4 text-left text-sm font-semibold text-gray-900">Features</th>
                      {comparison.products.map((product, pIndex) => (
                        <th key={pIndex} className="border-b-2 border-gray-200 bg-gray-50 p-4 text-center text-sm font-semibold text-gray-900">
                          <div className="flex flex-col items-center">
                            <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg mb-2" />
                            {product.name}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-b border-gray-200 p-4 text-sm text-gray-900 font-medium">Price</td>
                      {comparison.products.map((product, pIndex) => (
                        <td key={pIndex} className="border-b border-gray-200 p-4 text-center">{product.price}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border-b border-gray-200 p-4 text-sm text-gray-900 font-medium">Rating</td>
                      {comparison.products.map((product, pIndex) => (
                        <td key={pIndex} className="border-b border-gray-200 p-4 text-center">
                          <div className="flex items-center justify-center">
                            <span className="mr-2">{product.rating}/5</span>
                            <span className="text-yellow-400">★★★★★</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border-b border-gray-200 p-4 text-sm text-gray-900 font-medium">Pros</td>
                      {comparison.products.map((product, pIndex) => (
                        <td key={pIndex} className="border-b border-gray-200 p-4">
                          <ul className="list-disc pl-5 text-sm">
                            {product.pros.map((pro, proIndex) => (
                              <li key={proIndex}>{pro}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border-b border-gray-200 p-4 text-sm text-gray-900 font-medium">Cons</td>
                      {comparison.products.map((product, pIndex) => (
                        <td key={pIndex} className="border-b border-gray-200 p-4">
                          <ul className="list-disc pl-5 text-sm">
                            {product.cons.map((con, conIndex) => (
                              <li key={conIndex}>{con}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border-b border-gray-200 p-4 text-sm text-gray-900 font-medium">Best For</td>
                      {comparison.products.map((product, pIndex) => (
                        <td key={pIndex} className="border-b border-gray-200 p-4 text-center text-sm">{product.bestFor}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4"></td>
                      {comparison.products.map((product, pIndex) => (
                        <td key={pIndex} className="p-4 text-center">
                          <a 
                            href="#" 
                            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 inline-block text-sm"
                          >
                            View on Amazon
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Mobile Comparison Cards */}
              <div className="md:hidden space-y-8">
                {comparison.products.map((product, pIndex) => (
                  <div key={pIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b flex items-center">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                      <div>
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★★★★★</span>
                          <span className="text-sm text-gray-600">{product.rating}/5</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <span className="font-medium text-gray-900">Price:</span> {product.price}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Pros:</span>
                        <ul className="list-disc pl-5 text-sm mt-1">
                          {product.pros.map((pro, proIndex) => (
                            <li key={proIndex}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Cons:</span>
                        <ul className="list-disc pl-5 text-sm mt-1">
                          {product.cons.map((con, conIndex) => (
                            <li key={conIndex}>{con}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Best For:</span> {product.bestFor}
                      </div>
                      <a 
                        href="#" 
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 inline-block text-sm w-full text-center mt-2"
                      >
                        View on Amazon
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductComparison;
