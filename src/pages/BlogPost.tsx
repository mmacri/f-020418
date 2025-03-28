
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoSection from "@/components/VideoSection";
import { Link } from "react-router-dom";

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
      `,
      videoId: "Vl4KYSx1YmI",
      videoTitle: "Understanding Muscle Recovery",
      videoDescription: "Watch this video to learn more about the science of muscle recovery and how to optimize it.",
      author: "Dr. Emma Thompson",
      authorImage: "https://ext.same-assets.com/2783942035/2491380635.jpeg",
      authorBio: "Exercise Physiologist with 10+ years specializing in recovery protocols for elite athletes."
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
      `,
      videoId: "Y8Xp3NhQj6g",
      videoTitle: "Massage Gun Techniques for Recovery",
      videoDescription: "Learn the most effective techniques for using a massage gun to accelerate recovery and relieve muscle pain.",
      author: "Jason Taylor",
      authorImage: "https://ext.same-assets.com/8921309534/7182604153.jpeg",
      authorBio: "Physical therapist specializing in sports rehabilitation and recovery technologies."
    },
    "foam-rolling-guide": {
      title: "The Ultimate Guide to Foam Rolling",
      category: "Techniques",
      date: "July 8, 2023",
      readTime: "12 min read",
      featuredImage: "https://ext.same-assets.com/1001010124/foam-roller-guide.jpg",
      content: `
        <p class="text-lg mb-4">
          Foam rolling is one of the most effective self-care techniques for relieving muscle tension, improving flexibility, and enhancing recovery. This technique, also known as self-myofascial release (SMR), has gained popularity among athletes, fitness enthusiasts, and physical therapists for its ability to target tight fascia—the connective tissue surrounding muscles—and improve overall mobility.
        </p>
        <h2 class="text-2xl font-bold mt-8 mb-4">What is Foam Rolling?</h2>
        <p class="mb-4">
          Foam rolling involves using a cylindrical foam roller to apply pressure to specific areas of your body. By rolling the targeted muscle group over the foam roller, you apply pressure that helps release tightness and adhesions in the fascia—the thin layer of connective tissue that surrounds your muscles.
        </p>
        <p class="mb-6">
          Think of your muscles and fascia like a wool sweater that's been bunched up and twisted. Foam rolling helps to smooth everything back out, allowing your muscles to move more freely and efficiently.
        </p>
        <h2 class="text-2xl font-bold mt-8 mb-4">Key Benefits of Foam Rolling</h2>
        <ul class="list-disc pl-6 mb-6">
          <li class="mb-2"><strong>Reduces Muscle Soreness:</strong> Multiple studies have shown that foam rolling can significantly reduce delayed onset muscle soreness (DOMS) after intense exercise.</li>
          <li class="mb-2"><strong>Improves Blood Circulation:</strong> The pressure applied during foam rolling helps increase blood flow to muscles, delivering more oxygen and nutrients.</li>
          <li class="mb-2"><strong>Enhances Flexibility:</strong> Regular foam rolling can improve joint range of motion and flexibility without negatively impacting muscle performance.</li>
          <li class="mb-2"><strong>Prevents Injury:</strong> Addressing muscle imbalances and restrictions through regular foam rolling can help prevent common exercise-related injuries.</li>
        </ul>
        <h2 class="text-2xl font-bold mt-8 mb-4">How to Use a Foam Roller Effectively</h2>
        <p class="mb-4">
          Getting the most out of foam rolling requires proper technique:
        </p>
        <ol class="list-decimal pl-6 mb-6">
          <li class="mb-2"><strong>Choose the Right Roller:</strong> Beginners should start with a softer roller, while more experienced users might prefer a firmer roller with texture.</li>
          <li class="mb-2"><strong>Roll Slowly:</strong> Move at about 1 inch per second. Fast rolling won't be as effective.</li>
          <li class="mb-2"><strong>Focus on Tender Areas:</strong> When you find a tight or tender spot, pause and hold pressure on that area for 20-30 seconds.</li>
          <li class="mb-2"><strong>Breathe Deeply:</strong> Don't hold your breath. Breathe deeply to help your muscles relax.</li>
          <li class="mb-2"><strong>Stay Hydrated:</strong> Drink plenty of water before and after foam rolling to help with tissue elasticity.</li>
        </ol>
      `,
      videoId: "M8J6SZ7Y4RI",
      videoTitle: "Foam Rolling Techniques for Total Body Recovery",
      videoDescription: "This step-by-step guide demonstrates proper foam rolling techniques for all major muscle groups.",
      author: "Dr. Sarah Johnson",
      authorImage: "https://ext.same-assets.com/2783942035/2491380635.jpeg",
      authorBio: "Physical therapist with over 12 years of experience specializing in sports injury rehabilitation and recovery protocols."
    }
  };
  
  const post = articleSlug ? blogPosts[articleSlug as keyof typeof blogPosts] : null;

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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block bg-indigo-700 text-white text-sm py-1 px-3 rounded-md mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-col sm:flex-row justify-center items-center text-sm">
            {post.author && (
              <div className="flex items-center mb-2 sm:mb-0">
                <img 
                  src={post.authorImage} 
                  alt={post.author} 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span>By {post.author}</span>
              </div>
            )}
            <span className="mx-3 hidden sm:block">•</span>
            <span>{post.date}</span>
            <span className="mx-3 hidden sm:block">•</span>
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
            
            {/* Video Section */}
            {post.videoId && (
              <div className="my-12">
                <VideoSection 
                  title={post.videoTitle || "Watch Related Video"} 
                  description={post.videoDescription || "Learn more about this topic in the following video."} 
                  videoId={post.videoId} 
                />
              </div>
            )}
            
            {/* Author Bio */}
            {post.author && post.authorBio && (
              <div className="mt-12 pt-6 border-t border-gray-200">
                <div className="flex items-center">
                  <img src={post.authorImage} alt={post.author} className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <h3 className="font-bold text-gray-800">About {post.author}</h3>
                    <p className="text-gray-600">{post.authorBio}</p>
                  </div>
                </div>
              </div>
            )}
            
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

            {/* Related Articles */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/blog/foam-rolling-guide" className="block group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 h-full">
                    <div className="h-40 bg-gray-200 relative">
                      <img src="https://ext.same-assets.com/1001010124/foam-roller-guide.jpg" alt="Foam Rolling Guide" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors mb-2">The Ultimate Guide to Foam Rolling</h4>
                      <p className="text-sm text-gray-500">July 8, 2023 • 12 min read</p>
                    </div>
                  </div>
                </Link>
                <Link to="/blog/massage-gun-techniques" className="block group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 h-full">
                    <div className="h-40 bg-gray-200 relative">
                      <img src="https://ext.same-assets.com/198595764/1658350751.jpeg" alt="Massage Gun Techniques" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors mb-2">Massage Gun Techniques</h4>
                      <p className="text-sm text-gray-500">May 3, 2023 • 6 min read</p>
                    </div>
                  </div>
                </Link>
                <Link to="/blog/recovery-frequency" className="block group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 h-full">
                    <div className="h-40 bg-gray-200 relative">
                      <img src="https://ext.same-assets.com/30303034/muscle-recovery-science.jpg" alt="Recovery Frequency" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors mb-2">The Science of Muscle Recovery</h4>
                      <p className="text-sm text-gray-500">April 15, 2023 • 8 min read</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Newsletter Sign-up */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Get Recovery Tips & Exclusive Deals</h2>
          <p className="text-indigo-100 mb-8">
            Subscribe to our newsletter for expert recovery advice, product recommendations, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-md text-gray-800" 
            />
            <button className="bg-indigo-800 hover:bg-indigo-900 font-medium px-6 py-3 rounded-md whitespace-nowrap">
              Subscribe Now
            </button>
          </div>
          <p className="text-xs text-indigo-200 mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
