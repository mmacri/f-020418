
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RecoveryApps = () => {
  const apps = [
    {
      name: "Hyperice",
      description: "Connect with Hyperice devices for guided recovery routines and track your recovery progress.",
      platforms: ["iOS", "Android"],
      price: "Free with Hyperice devices",
      rating: 4.6,
      features: ["Guided routines", "Device synchronization", "Recovery tracking", "Personalized recommendations"],
      image: "https://ext.same-assets.com/30303037/app-hyperice.jpg"
    },
    {
      name: "WHOOP",
      description: "Track recovery, strain, and sleep to optimize your training and recovery cycles.",
      platforms: ["iOS", "Android"],
      price: "Subscription-based ($30/month)",
      rating: 4.7,
      features: ["Recovery tracking", "Sleep analysis", "Strain monitoring", "Heart rate variability tracking"],
      image: "https://ext.same-assets.com/30303037/app-whoop.jpg"
    },
    {
      name: "Therabody",
      description: "Connect with Therabody devices and access guided routines for targeted recovery.",
      platforms: ["iOS", "Android"],
      price: "Free with Therabody devices",
      rating: 4.5,
      features: ["Personalized routines", "Device control", "Wellness programs", "Integration with Apple Health"],
      image: "https://ext.same-assets.com/30303037/app-therabody.jpg"
    },
    {
      name: "Oura Ring",
      description: "Track sleep, activity, and readiness to understand your body's recovery needs.",
      platforms: ["iOS", "Android"],
      price: "Free with Oura Ring purchase",
      rating: 4.8,
      features: ["Sleep tracking", "Readiness score", "Activity monitoring", "Temperature tracking"],
      image: "https://ext.same-assets.com/30303037/app-oura.jpg"
    },
    {
      name: "StretchIt",
      description: "Guided stretching routines for flexibility, mobility, and recovery.",
      platforms: ["iOS", "Android", "Web"],
      price: "$19.99/month or $119.99/year",
      rating: 4.7,
      features: ["HD video tutorials", "Customizable routines", "Progress tracking", "Beginner to advanced levels"],
      image: "https://ext.same-assets.com/30303037/app-stretchit.jpg"
    },
    {
      name: "Noom",
      description: "Psychology-based approach to wellness, including recovery and healthy habits.",
      platforms: ["iOS", "Android"],
      price: "Subscription-based (varies)",
      rating: 4.3,
      features: ["Personalized coaching", "Habit tracking", "Educational content", "Goal setting"],
      image: "https://ext.same-assets.com/30303037/app-noom.jpg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Best Recovery Apps</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Track, optimize, and improve your recovery with these top-rated mobile applications.
          </p>
        </div>
      </section>

      {/* Apps Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6">Why Use Recovery Apps?</h2>
            <p className="text-lg text-gray-600 mb-6">
              Recovery apps can help you track and optimize your body's recovery process, ensuring you're making the most of your rest days and recovery tools. From guided routines with massage guns and foam rollers to sleep tracking and readiness scores, these apps bring science-based recovery methods to your fingertips.
            </p>
            <p className="text-lg text-gray-600">
              We've reviewed dozens of recovery-focused applications to bring you the best options for tracking, optimizing, and improving your recovery process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apps.map((app, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition duration-300 hover:shadow-lg">
                <div className="h-48 bg-gray-200 relative">
                  <img src={app.image || `https://ext.same-assets.com/30303037/team-member-${index + 1}.jpg`} alt={app.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl">{app.name}</h3>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm">{app.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{app.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-900">Available on: </span>
                    <span className="text-sm text-gray-600">{app.platforms.join(", ")}</span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-900">Price: </span>
                    <span className="text-sm text-gray-600">{app.price}</span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Key Features:</p>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      {app.features.slice(0, 3).map((feature, fIndex) => (
                        <li key={fIndex}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <a 
                    href="#" 
                    className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition duration-300"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RecoveryApps;
