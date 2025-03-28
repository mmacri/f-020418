
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
      title: "How Often Should You Use Recovery Tools?",
      category: "Recovery Science",
      date: "April 12, 2023",
      readTime: "5 min read",
      featuredImage: "https://ext.same-assets.com/4181642789/575270868.jpeg",
      author: "Elena Rodriguez",
      authorImage: "https://ext.same-assets.com/2651616194/3622592620.jpeg",
      authorBio: "Fitness recovery specialist with expertise in optimizing recovery protocols for athletes of all levels.",
      content: `
        <p class="text-lg font-medium text-gray-800 mb-6">
          "How often should I use recovery tools?" is one of the most common questions we receive from our community. Whether it's about massage guns, foam rollers, compression gear, or other recovery modalities, finding the right frequency is crucial for maximizing benefits without overdoing it.
        </p>

        <p class="text-gray-700 mb-6">
          This guide breaks down the optimal usage frequency for different recovery tools based on scientific research, expert recommendations, and real-world application. We'll cover specific protocols for various fitness levels, activity types, and recovery needs.
        </p>

        <div class="bg-indigo-50 p-6 rounded-lg my-8">
          <h3 class="font-bold text-xl mb-3">Coming Soon</h3>
          <p class="text-gray-700">
            We're currently finalizing this practical guide on recovery tool frequency. Check back soon for the complete article, or subscribe to our newsletter to be notified when it's published.
          </p>
        </div>
      `
    },
    "massage-gun-techniques": {
      title: "6 Effective Massage Gun Techniques for Faster Recovery",
      category: "Techniques",
      date: "May 14, 2023",
      readTime: "8 min read",
      featuredImage: "https://ext.same-assets.com/198595764/1658350751.jpeg",
      author: "Dr. Sarah Johnson",
      authorImage: "https://ext.same-assets.com/2783942035/2491380635.jpeg",
      authorBio: "Physical therapist with over 12 years of experience specializing in sports injury rehabilitation and recovery protocols.",
      content: `
        <p class="text-lg font-medium text-gray-800 mb-6">
          Whether you're a professional athlete, fitness enthusiast, or someone dealing with everyday muscle tension,
          a massage gun can be a game-changer for your recovery routine. But simply turning it on and moving it around
          randomly won't deliver the best results. In this guide, we'll explore effective techniques to maximize the
          benefits of your percussion therapy device.
        </p>

        <div class="bg-indigo-50 p-6 rounded-lg my-8">
          <h3 class="font-bold text-xl mb-3">Important Safety Notes</h3>
          <ul class="list-disc pl-6 space-y-2 text-gray-700">
            <li>Never use a massage gun directly on bones, joints, or nerves</li>
            <li>Avoid using on injuries, inflamed areas, or broken skin</li>
            <li>Start with the lowest intensity setting and gradually increase as needed</li>
            <li>Limit treatment to 2 minutes per muscle group</li>
            <li>If you experience pain (beyond normal muscle soreness), stop immediately</li>
            <li>Consult a healthcare professional if you have medical conditions or concerns</li>
          </ul>
        </div>

        <h2 class="text-3xl font-bold text-gray-800 my-8">Essential Massage Gun Techniques</h2>

        <!-- Technique 1 -->
        <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
          <h3 class="text-2xl font-bold text-indigo-800 mb-4">1. Float and Glide</h3>
          <div class="flex flex-col md:flex-row gap-6 mb-4">
            <div class="md:w-1/3">
              <img src="https://ext.same-assets.com/198595764/1658350751.jpeg" alt="Float and Glide Technique" class="rounded-lg shadow-sm">
            </div>
            <div class="md:w-2/3">
              <p class="text-gray-700 mb-4">
                The most basic and versatile technique. Without applying additional pressure, let the massage gun float along
                the muscle, gliding slowly (about 1-2 inches per second). This distributes the percussion evenly throughout the muscle tissue.
              </p>
              <h4 class="font-bold mt-4 mb-2">When to use:</h4>
              <p class="text-gray-700">
                Ideal for warming up muscles pre-workout, general muscle maintenance, or as a starting point before using more targeted techniques.
              </p>
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded text-sm text-gray-600">
            <strong>Pro Tip:</strong> Keep the massage gun perpendicular to the muscle rather than at an angle for optimal percussion depth.
          </div>
        </div>

        <!-- Technique 2 -->
        <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
          <h3 class="text-2xl font-bold text-indigo-800 mb-4">2. Press and Hold</h3>
          <div class="flex flex-col md:flex-row gap-6 mb-4">
            <div class="md:w-1/3">
              <img src="https://ext.same-assets.com/1926211595/4269912841.jpeg" alt="Press and Hold Technique" class="rounded-lg shadow-sm">
            </div>
            <div class="md:w-2/3">
              <p class="text-gray-700 mb-4">
                For targeting specific knots or trigger points, apply the massage gun directly to the spot and hold with light to medium pressure for 15-30 seconds. The sustained percussion helps release stubborn tension points.
              </p>
              <h4 class="font-bold mt-4 mb-2">When to use:</h4>
              <p class="text-gray-700">
                Perfect for addressing specific areas of tension, muscle knots, or trigger points that don't release with regular movement techniques.
              </p>
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded text-sm text-gray-600">
            <strong>Pro Tip:</strong> Start with lower pressure and gradually increase to avoid discomfort. Use a round or flat attachment for this technique.
          </div>
        </div>
      `,
      videoId: "xMbU2JK9x50",
      videoTitle: "Massage Gun Techniques Demonstration",
      videoDescription: "Watch this video tutorial to see these techniques in action and learn proper form:"
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
                      <p className="text-sm text-gray-500">May 14, 2023 • 8 min read</p>
                    </div>
                  </div>
                </Link>
                <Link to="/blog/recovery-frequency" className="block group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 h-full">
                    <div className="h-40 bg-gray-200 relative">
                      <img src="https://ext.same-assets.com/4181642789/575270868.jpeg" alt="Recovery Frequency" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors mb-2">How Often Should You Use Recovery Tools?</h4>
                      <p className="text-sm text-gray-500">April 12, 2023 • 5 min read</p>
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
