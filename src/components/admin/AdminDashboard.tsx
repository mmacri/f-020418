
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, BarChart2, LineChart, Package, Users, File, DollarSign, MousePointer } from "lucide-react";
import { 
  BarChart,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart as ReLineChart,
  Line
} from "recharts";
import { getProducts } from "@/services/productService";
import { getAllPosts } from "@/services/blogService";

// Mock data for the dashboard
const clicksData = [
  { name: "Mon", value: 120 },
  { name: "Tue", value: 156 },
  { name: "Wed", value: 143 },
  { name: "Thu", value: 198 },
  { name: "Fri", value: 232 },
  { name: "Sat", value: 278 },
  { name: "Sun", value: 224 },
];

const revenueData = [
  { name: "Mon", value: 240 },
  { name: "Tue", value: 312 },
  { name: "Wed", value: 286 },
  { name: "Thu", value: 396 },
  { name: "Fri", value: 464 },
  { name: "Sat", value: 556 },
  { name: "Sun", value: 448 },
];

const productCategoryData = [
  { name: "Massage Guns", value: 35 },
  { name: "Foam Rollers", value: 25 },
  { name: "Compression", value: 20 },
  { name: "Resistance", value: 15 },
  { name: "Other", value: 5 },
];

const AdminDashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [blogPostCount, setBlogPostCount] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [estimatedRevenue, setEstimatedRevenue] = useState(0);
  const [timeframe, setTimeframe] = useState("week");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load product count
        const products = await getProducts();
        setProductCount(products.length);
        
        // Load blog post count
        const posts = await getAllPosts();
        setBlogPostCount(posts.length);
        
        // Calculate clicks from mock data
        const total = clicksData.reduce((sum, item) => sum + item.value, 0);
        setTotalClicks(total);
        
        // Calculate revenue from mock data
        const revenue = revenueData.reduce((sum, item) => sum + item.value, 0);
        setEstimatedRevenue(revenue);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };
    
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
            <p className="text-xs text-gray-500">Active product listings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <File className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogPostCount}</div>
            <p className="text-xs text-gray-500">Published articles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affiliate Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUp className="mr-1 h-3 w-3" />
              <span>18.2% from last week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${estimatedRevenue.toFixed(2)}</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUp className="mr-1 h-3 w-3" />
              <span>12.5% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
          <CardDescription>
            Track your website's performance and sales metrics
          </CardDescription>
          <TabsList className="mt-2">
            <TabsTrigger value="week" onClick={() => setTimeframe("week")}>
              This Week
            </TabsTrigger>
            <TabsTrigger value="month" onClick={() => setTimeframe("month")}>
              This Month
            </TabsTrigger>
            <TabsTrigger value="year" onClick={() => setTimeframe("year")}>
              This Year
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="px-2">
          <Tabs defaultValue="clicks">
            <div className="flex justify-center mb-4">
              <TabsList>
                <TabsTrigger value="clicks" className="flex items-center">
                  <MousePointer className="mr-2 h-4 w-4" />
                  Affiliate Clicks
                </TabsTrigger>
                <TabsTrigger value="revenue" className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Revenue
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Categories
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="clicks" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart
                  data={clicksData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                </ReLineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="revenue" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart
                  data={revenueData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </ReLineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="categories" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productCategoryData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Product Added", item: "Hyperice Hypervolt Go", time: "Today, 10:15 AM" },
                { action: "Blog Post Published", item: "Top 5 Recovery Tools for Athletes", time: "Yesterday, 3:45 PM" },
                { action: "Product Updated", item: "Theragun Pro - Price Updated", time: "Yesterday, 1:20 PM" },
                { action: "Category Added", item: "Stretching Equipment", time: "2 days ago" },
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="font-medium">{item.action}</p>
                    <p className="text-sm text-gray-500">{item.item}</p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Popular Products</CardTitle>
            <CardDescription>Most clicked affiliate products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Theragun Pro", clicks: 458, conversion: "4.3%" },
                { name: "TriggerPoint GRID Foam Roller", clicks: 356, conversion: "5.2%" },
                { name: "Hypervolt Plus", clicks: 289, conversion: "3.9%" },
                { name: "Compex Sport Elite", clicks: 213, conversion: "3.2%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full mr-3 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.clicks} clicks</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">{item.conversion}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
