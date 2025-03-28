
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BlogPost = () => {
  const { articleSlug } = useParams<{ articleSlug: string }>();
  
  // This would typically come from an API or CMS
  const blogPosts = {
    "recovery-frequency": {
      title: "The Science Behind Muscle Recovery",
      category: "Recovery Science",
      date: "April 15, 2023",
      readTime: "8 min read",
      featuredImage: "https://ext.same-assets.com/30303034/muscle-recovery-science.jpg",
      content: `
        <p class="text-lg mb-4">
          Understanding the science behind muscle recovery is essential for optimizing your fitness routine. When you exercise, especially during strength training, you create microscopic tears in your muscle fibers. This damage triggers an inflammatory response as your body works to repair the tissue.
        </p>
        <h2 class="text-2xl font-bold mt-8 mb-4">The Recovery Process</h2>
        <p class="mb-4">
          Muscle recovery happens in several phases:
        </p>
        <ul class="list-disc pl-6 mb-6">
          <li class="mb-2"><strong>Inflammation Phase:</strong> Immediately after exercise, blood flow increases to the worked muscles, bringing nutrients and immune cells to begin the repair process.</li>
          <li class="mb-2"><strong>Repair Phase:</strong> During this phase, your body synthesizes proteins to rebuild the damaged muscle fibers.</li>
          <li class="mb-2"><strong>Growth Phase:</strong> As repairs continue, the muscle adapts by becoming stronger and, in some cases, larger than before.</li>
        </ul>
        <p class="mb-6">
          Research shows that complete muscle recovery can take anywhere from 24-72 hours, depending on the intensity of your workout, your fitness level, age, and other factors.
        </p>
        <h2 class="text-2xl font-bold mt-8 mb-4">Optimizing Recovery</h2>
        <p class="mb-4">
          To enhance your recovery process, consider these evidence-based strategies:
        </p>
        <ol class="list-decimal pl-6 mb-6">
          <li class="mb-2"><strong>Adequate Protein Intake:</strong> Consuming 20-40g of protein within the anabolic window (within a few hours after exercise) can enhance muscle protein synthesis.</li>
          <li class="mb-2"><strong>Quality Sleep:</strong> During deep sleep, your body releases growth hormone, which is crucial for tissue repair and recovery.</li>
          <li class="mb-2"><strong>Active Recovery:</strong> Light activity like walking or swimming can increase blood flow to muscles without causing additional damage.</li>
          <li class="mb-2"><strong>Hydration:</strong> Maintaining proper fluid balance is essential for nutrient delivery and waste removal from muscles.</li>
          <li class="mb-2"><strong>Recovery Tools:</strong> Devices like massage guns, foam rollers, and compression gear can help reduce muscle soreness and speed up recovery.</li>
        </ol>
      `
    },
    "massage-gun-techniques": {
      title: "How to Choose the Right Massage Gun",
      category: "Buying Guide",
      date: "May 3, 2023",
      readTime: "6 min read",
      featuredImage: "https://ext.same-assets.com/30303035/choosing-massage-gun.jpg",
      content: `
        <p class="text-lg mb-4">
          Massage guns have become increasingly popular recovery tools, but with so many options on the market, choosing the right one can be overwhelming. This guide will help you understand the key features to consider.
        </p>
        <h2 class="text-2xl font-bold mt-8 mb-4">What to Look for in a Massage Gun</h2>
        <p class="mb-6">
          When shopping for a massage gun, consider these important factors:
        </p>
        <h3 class="text-xl font-bold mt-6 mb-3">1. Amplitude (Stroke Length)</h3>
        <p class="mb-4">
          This measures how deep the massage gun head moves into your muscle. Professional-grade devices typically offer 16mm or more, while budget options might only provide 10-12mm.
        </p>
        <h3 class="text-xl font-bold mt-6 mb-3">2. Stall Force</h3>
        <p class="mb-4">
          This is the amount of pressure the device can handle before the motor stalls. Higher stall force (30+ pounds) is better for deep tissue work and larger muscle groups.
        </p>
        <h3 class="text-xl font-bold mt-6 mb-3">3. Speed Options</h3>
        <p class="mb-4">
          Most quality massage guns offer multiple speed settings, typically ranging from 1,200 to 3,200 percussions per minute. Having at least 3-5 speed options provides versatility for different body parts and recovery needs.
        </p>
        <h3 class="text-xl font-bold mt-6 mb-3">4. Battery Life</h3>
        <p class="mb-4">
          Look for devices with at least 2-3 hours of battery life per charge. This ensures you won't constantly need to recharge after short sessions.
        </p>
        <h3 class="text-xl font-bold mt-6 mb-3">5. Noise Level</h3>
        <p class="mb-4">
          Lower-quality massage guns can be quite loud, which may limit when and where you use them. Premium options typically operate at 60 decibels or lower.
        </p>
      `
    }
  };
  
  const post = blogPosts[articleSlug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 flex-grow">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been moved.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Article Header */}
      <div className="bg-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block bg-indigo-700 text-white text-sm py-1 px-3 rounded-md mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex justify-center items-center text-sm">
            <span>{post.date}</span>
            <span className="mx-3">•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-3xl mx-auto">
          <img 
            src={post.featuredImage} 
            alt={post.title} 
            className="w-full h-auto rounded-lg shadow-xl"
          />
        </div>
      </div>
      
      {/* Article Content */}
      <article className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            {/* Related Products */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-2xl font-bold mb-6">Recommended Recovery Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4 flex">
                  <img src="https://ext.same-assets.com/30303030/massage-gun-category.jpg" alt="Recommended product" className="w-24 h-24 object-cover rounded" />
                  <div className="ml-4">
                    <h4 className="font-bold">TheraGun Pro</h4>
                    <p className="text-gray-600 text-sm mb-2">Professional-grade percussion massager with 16mm amplitude</p>
                    <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View on Amazon →</a>
                  </div>
                </div>
                <div className="border rounded-lg p-4 flex">
                  <img src="https://ext.same-assets.com/30303031/foam-roller-category.jpg" alt="Recommended product" className="w-24 h-24 object-cover rounded" />
                  <div className="ml-4">
                    <h4 className="font-bold">TriggerPoint GRID Foam Roller</h4>
                    <p className="text-gray-600 text-sm mb-2">Multi-density foam roller for targeted muscle relief</p>
                    <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View on Amazon →</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
