
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      slug: "recovery-frequency",
      title: "The Science Behind Muscle Recovery",
      excerpt: "Understand the physiological processes behind muscle recovery and how to optimize them for better results.",
      image: "https://ext.same-assets.com/30303034/muscle-recovery-science.jpg",
      category: "Recovery Science",
      date: "April 15, 2023",
      readTime: "8 min read"
    },
    {
      id: 2,
      slug: "massage-gun-techniques",
      title: "How to Choose the Right Massage Gun",
      excerpt: "Discover the key features to consider when selecting a massage gun for your specific recovery needs.",
      image: "https://ext.same-assets.com/30303035/choosing-massage-gun.jpg",
      category: "Buying Guide",
      date: "May 3, 2023",
      readTime: "6 min read"
    },
    {
      id: 3,
      slug: "active-vs-passive-recovery",
      title: "Essential Recovery Routines for Runners",
      excerpt: "Follow these research-backed recovery routines to enhance performance and prevent common running injuries.",
      image: "https://ext.same-assets.com/30303036/runner-recovery-routine.jpg",
      category: "Running Recovery",
      date: "June 21, 2023",
      readTime: "10 min read"
    },
    {
      id: 4,
      slug: "foam-rolling-guide",
      title: "The Ultimate Guide to Foam Rolling",
      excerpt: "Learn proper foam rolling techniques to relieve muscle tension and improve flexibility.",
      image: "https://ext.same-assets.com/30303031/foam-roller-category.jpg",
      category: "Techniques",
      date: "July 8, 2023",
      readTime: "12 min read"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Recovery Essentials Blog</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Expert advice, tips, and science-backed information to help you optimize your recovery and performance.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md transition transform hover:shadow-xl">
                <div className="h-48 bg-gray-200 relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs py-1 px-2 rounded-md">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">
                    <Link to={`/blog/${post.slug}`} className="text-gray-900 hover:text-indigo-600">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter callout */}
      <section className="py-12 bg-indigo-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated with Our Latest Articles</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Get our latest recovery tips, product recommendations, and special offers delivered straight to your inbox.
          </p>
          <Link to="/newsletter" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-md transition duration-300">
            Subscribe to Our Newsletter
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
