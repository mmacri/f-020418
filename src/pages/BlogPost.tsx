
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoSection from "@/components/VideoSection";
import { getBlogPostBySlug, BlogPost } from "@/services/blog";
import { Loader2 } from "lucide-react";
import { ImageWithFallback } from "@/lib/images";

// Helper function to convert Markdown to HTML
const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Convert headings
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Convert bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert italic text
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800">$1</a>');
  
  // Convert images
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="my-4 max-w-full h-auto rounded-lg shadow-sm" />');
  
  // Convert bullet lists (handle multi-level)
  let inList = false;
  const lines = html.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    // Bullet list item
    if (lines[i].match(/^- (.*$)/)) {
      if (!inList) {
        lines[i] = '<ul class="list-disc pl-6 my-4">' + lines[i].replace(/^- (.*)$/, '<li>$1</li>');
        inList = true;
      } else {
        lines[i] = lines[i].replace(/^- (.*)$/, '<li>$1</li>');
      }
      
      // Check if the next line is NOT a list item
      if (i === lines.length - 1 || !lines[i + 1].match(/^- (.*$)/)) {
        lines[i] += '</ul>';
        inList = false;
      }
    }
    // Numbered list item
    else if (lines[i].match(/^\d+\. (.*$)/)) {
      if (!inList) {
        lines[i] = '<ol class="list-decimal pl-6 my-4">' + lines[i].replace(/^\d+\. (.*)$/, '<li>$1</li>');
        inList = true;
      } else {
        lines[i] = lines[i].replace(/^\d+\. (.*)$/, '<li>$1</li>');
      }
      
      // Check if the next line is NOT a list item
      if (i === lines.length - 1 || !lines[i + 1].match(/^\d+\. (.*$)/)) {
        lines[i] += '</ol>';
        inList = false;
      }
    }
  }
  
  // Convert back to string and handle paragraphs
  html = lines.join('\n');
  
  // Convert paragraphs (any line that doesn't start with a tag)
  html = html.replace(/^(?!<[a-z][a-z0-9]*>)(.*$)/gm, function(match) {
    // Skip empty lines
    if (match.trim() === '') return '';
    return '<p class="mb-4">' + match + '</p>';
  });
  
  return html;
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!slug) {
          setError("Blog post not found");
          return;
        }
        
        const blogPost = await getBlogPostBySlug(slug);
        
        if (blogPost) {
          setPost(blogPost);
        } else {
          setError("Blog post not found");
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load blog post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600 mb-4" />
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 flex-grow">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">{error || "The article you're looking for doesn't exist or has been moved."}</p>
            <Link to="/blog" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 inline-block">
              Browse All Articles
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Use the appropriate image URL
  const imageUrl = post.image || post.image_url || post.coverImage || "https://placehold.co/600x400?text=No+Image";
  // Convert Markdown content to HTML
  const contentHtml = markdownToHtml(post.content);

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
                <span>By {post.author}</span>
              </div>
            )}
            <span className="mx-3 hidden sm:block">•</span>
            <span>{post.date}</span>
            <span className="mx-3 hidden sm:block">•</span>
            <span>{post.readTime || post.read_time || `${Math.ceil(post.content.length / 1000)} min read`}</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-3xl mx-auto">
          <ImageWithFallback 
            src={imageUrl} 
            alt={post.title} 
            className="w-full h-auto rounded-lg shadow-xl"
          />
        </div>
      </div>
      
      {/* Article Content */}
      <article className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: contentHtml }} />
            
            {/* Author Bio */}
            {post.author && (
              <div className="mt-12 pt-6 border-t border-gray-200">
                <div className="flex items-center">
                  <div>
                    <h3 className="font-bold text-gray-800">About {post.author}</h3>
                  </div>
                </div>
              </div>
            )}
            
            {/* Related Products Section */}
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

            {/* Newsletter Sign-up */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-2xl font-bold mb-4">Get More Recovery Tips</h3>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter to receive more expert tips, product recommendations, and exclusive offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                />
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-md whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* More Articles Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">More Articles You Might Like</h2>
          <div className="max-w-5xl mx-auto">
            <Link to="/blog" className="inline-block w-full text-center bg-white border border-indigo-600 text-indigo-600 px-6 py-3 rounded-md hover:bg-indigo-50 font-medium mt-8">
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
