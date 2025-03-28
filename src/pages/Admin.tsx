
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Cog, Info, LockKeyhole, Pencil, Plus, Trash2, Package, FileText, LayoutGrid } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleLogin = () => {
    // In a real application, this would verify credentials against a backend
    if (email === "admin@recoveryessentials.com" && password === "admin123") {
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800 mb-6">
              <div className="flex items-center mb-2">
                <Info className="w-5 h-5 mr-2" />
                <p className="font-medium">Access Restricted</p>
              </div>
              <p className="text-sm">
                Please log in with administrator credentials to access the dashboard.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@recoveryessentials.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">
                  For demo: use "admin@recoveryessentials.com" and "admin123"
                </p>
              </div>
              
              <Button
                type="button"
                className="w-full"
                onClick={handleLogin}
              >
                Log In
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="products">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Products</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Product
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Create, edit and manage your affiliate products.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <Package className="h-8 w-8 text-indigo-600 mr-3" />
                          <div>
                            <p className="font-medium">Product {item}</p>
                            <p className="text-sm text-gray-500">$99.99</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="blog" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Blog Posts</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Post
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
                <CardDescription>
                  Create, edit and manage your blog content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "How Often Should You Use Recovery Tools?",
                    "6 Effective Massage Gun Techniques for Faster Recovery",
                    "The Ultimate Guide to Foam Rolling",
                    "Essential Recovery Routines for Runners"
                  ].map((title, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 text-indigo-600 mr-3" />
                          <div>
                            <p className="font-medium">{title}</p>
                            <p className="text-sm text-gray-500">Published: April {(index + 1) * 5}, 2023</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Categories</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Category
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Navigation Categories</CardTitle>
                <CardDescription>
                  Create, edit and manage your site's navigation structure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Massage Guns", subcategories: ["Percussion", "Vibration", "Heated"] },
                    { name: "Foam Rollers", subcategories: ["Standard", "Textured", "Vibrating"] },
                    { name: "Fitness Bands", subcategories: ["Resistance Loops", "Pull-up Bands", "Therapy Bands"] },
                    { name: "Compression Gear", subcategories: ["Sleeves", "Socks", "Full Body"] }
                  ].map((category, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <LayoutGrid className="h-6 w-6 text-indigo-600 mr-3" />
                          <p className="font-medium">{category.name}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="pl-9">
                        <p className="text-sm text-gray-700 mb-1">Subcategories:</p>
                        <div className="flex flex-wrap gap-2">
                          {category.subcategories.map((subcat, i) => (
                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {subcat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
