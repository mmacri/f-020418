
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SearchBox } from "@/components/SearchBox";
import ProductCard from "@/components/ProductCard";
import BlogPostCard from "@/components/BlogPostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchProducts } from "@/services/productService";
import { searchBlogPosts } from "@/services/blogService";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const [productsData, blogData] = await Promise.all([
          searchProducts(query),
          searchBlogPosts(query)
        ]);
        setProducts(productsData);
        setBlogPosts(blogData);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold">Search Results</h1>
          <p className="text-muted-foreground">
            {query ? `Showing results for "${query}"` : "Enter a search term to find products and articles"}
          </p>
          <div className="max-w-xl">
            <SearchBox 
              variant="full" 
              placeholder="Refine your search..."
              className="w-full" 
            />
          </div>
        </div>

        {query ? (
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                All Results ({products.length + blogPosts.length})
              </TabsTrigger>
              <TabsTrigger value="products">
                Products ({products.length})
              </TabsTrigger>
              <TabsTrigger value="articles">
                Articles ({blogPosts.length})
              </TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-[300px] rounded-lg bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="all">
                  {products.length === 0 && blogPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-medium mb-2">No results found</h3>
                      <p className="text-muted-foreground">Try using different keywords or check your spelling</p>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {products.length > 0 && (
                        <div>
                          <h2 className="text-2xl font-bold mb-4">Products</h2>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {products.slice(0, 3).map((product) => (
                              <ProductCard key={product.id} product={product} />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {blogPosts.length > 0 && (
                        <div>
                          <h2 className="text-2xl font-bold mb-4">Articles</h2>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {blogPosts.slice(0, 3).map((post) => (
                              <BlogPostCard key={post.id} post={post} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="products">
                  {products.length === 0 ? (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-medium mb-2">No products found</h3>
                      <p className="text-muted-foreground">Try using different keywords or check your spelling</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="articles">
                  {blogPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-medium mb-2">No articles found</h3>
                      <p className="text-muted-foreground">Try using different keywords or check your spelling</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {blogPosts.map((post) => (
                        <BlogPostCard key={post.id} post={post} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Enter a search term</h3>
            <p className="text-muted-foreground">
              Use the search box above to find products and articles
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Search;
