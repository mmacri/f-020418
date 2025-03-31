
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { RefreshCw } from "lucide-react";

const PreferencesSettings = () => {
  const [cacheSize, setCacheSize] = useState<string>("0 KB");
  const { toast } = useToast();
  
  // Calculate cache size
  const calculateCacheSize = () => {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith('api_cache_'));
    
    let totalSize = 0;
    cacheKeys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length * 2; // Approximate size in bytes (2 bytes per character)
      }
    });
    
    // Convert to human-readable format
    let size = "0 KB";
    if (totalSize < 1024) {
      size = `${totalSize} B`;
    } else if (totalSize < 1024 * 1024) {
      size = `${(totalSize / 1024).toFixed(2)} KB`;
    } else {
      size = `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
    }
    
    setCacheSize(size);
  };
  
  useEffect(() => {
    calculateCacheSize();
  }, []);
  
  // Clear cache
  const handleClearCache = () => {
    const clearedCount = api.clearCache();
    calculateCacheSize();
    
    toast({
      title: "Cache Cleared",
      description: `${clearedCount} cached items have been cleared successfully`,
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cache Management</CardTitle>
          <CardDescription>
            Manage browser cache for better performance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Cache Size</p>
              <p className="text-muted-foreground text-sm">{cacheSize}</p>
            </div>
            <Button 
              onClick={handleClearCache} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Clear Cache</span>
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Use Data Caching</Label>
              <p className="text-xs text-muted-foreground">
                Enable caching for faster page loads
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Dark Mode</Label>
              <p className="text-xs text-muted-foreground">
                Use dark theme for the admin dashboard
              </p>
            </div>
            <Switch defaultChecked={false} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive email notifications for important events
              </p>
            </div>
            <Switch defaultChecked={true} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Interface Settings</CardTitle>
          <CardDescription>
            Customize your admin interface experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultTab">Default Tab</Label>
            <select 
              id="defaultTab" 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="dashboard"
            >
              <option value="dashboard">Dashboard</option>
              <option value="products">Products</option>
              <option value="categories">Categories</option>
              <option value="content">Content</option>
              <option value="blog">Blog</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Choose which tab to show by default when opening the admin panel
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="itemsPerPage">Items Per Page</Label>
            <Input
              id="itemsPerPage"
              type="number"
              defaultValue={10}
              min={5}
              max={100}
            />
            <p className="text-xs text-muted-foreground">
              Number of items to display in tables and lists
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesSettings;
