
import { useState } from "react";
import { Download, Upload, Settings, Database, Save, AlertCircle, RotateCw, FileJson } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema for Amazon settings
const amazonSettingsSchema = z.object({
  associateId: z.string().min(1, { message: "Associate ID is required" }),
  apiAccessKey: z.string().min(1, { message: "API Access Key is required" }),
  apiSecretKey: z.string().min(1, { message: "API Secret Key is required" }),
  marketplace: z.enum(["US", "CA", "UK", "DE", "FR", "ES", "IT", "JP", "AU"], {
    message: "Please select a marketplace",
  }),
});

type AmazonSettingsValues = z.infer<typeof amazonSettingsSchema>;

// Schema for site settings
const siteSettingsSchema = z.object({
  siteName: z.string().min(1, { message: "Site name is required" }),
  siteDescription: z.string().min(1, { message: "Site description is required" }),
  contactEmail: z.string().email({ message: "Please enter a valid email" }),
  analyticsId: z.string().optional(),
  enableAffiliateBadges: z.boolean().default(true),
  showPricesWithTax: z.boolean().default(true),
  showOutOfStockProducts: z.boolean().default(true),
});

type SiteSettingsValues = z.infer<typeof siteSettingsSchema>;

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();

  // Initialize the form for Amazon settings
  const amazonForm = useForm<AmazonSettingsValues>({
    resolver: zodResolver(amazonSettingsSchema),
    defaultValues: {
      associateId: "recoveryessentials-20",
      apiAccessKey: "",
      apiSecretKey: "",
      marketplace: "US",
    },
  });

  // Initialize the form for site settings
  const siteForm = useForm<SiteSettingsValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: "Recovery Essentials",
      siteDescription: "The best recovery products and reviews",
      contactEmail: "contact@recoveryessentials.com",
      analyticsId: "",
      enableAffiliateBadges: true,
      showPricesWithTax: true,
      showOutOfStockProducts: true,
    },
  });

  // Handle Amazon settings save
  const handleSaveAmazonSettings = (data: AmazonSettingsValues) => {
    setIsLoading(true);
    
    // Simulate saving
    setTimeout(() => {
      // In a real app, we would save this to an API
      localStorage.setItem("amazonSettings", JSON.stringify(data));
      
      setIsLoading(false);
      toast({
        title: "Settings Saved",
        description: "Your Amazon affiliate settings have been saved.",
      });
    }, 1000);
  };

  // Handle site settings save
  const handleSaveSiteSettings = (data: SiteSettingsValues) => {
    setIsLoading(true);
    
    // Simulate saving
    setTimeout(() => {
      // In a real app, we would save this to an API
      localStorage.setItem("siteSettings", JSON.stringify(data));
      
      setIsLoading(false);
      toast({
        title: "Settings Saved",
        description: "Your site settings have been saved.",
      });
    }, 1000);
  };

  // Handle database export
  const handleExportDatabase = () => {
    setIsExporting(true);
    
    // Simulate export
    setTimeout(() => {
      try {
        // Get all data from localStorage
        const data = {
          products: JSON.parse(localStorage.getItem("products") || "[]"),
          categories: JSON.parse(localStorage.getItem("categories") || "[]"),
          blogPosts: JSON.parse(localStorage.getItem("blogPosts") || "[]"),
          amazonSettings: JSON.parse(localStorage.getItem("amazonSettings") || "{}"),
          siteSettings: JSON.parse(localStorage.getItem("siteSettings") || "{}"),
        };
        
        // Create a JSON file for download
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `recovery-essentials-backup-${new Date().toISOString()}.json`;
        
        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
        
        toast({
          title: "Export Successful",
          description: "Your database has been exported successfully.",
        });
      } catch (error) {
        console.error("Export error:", error);
        toast({
          title: "Export Failed",
          description: "There was an error exporting your database.",
          variant: "destructive",
        });
      } finally {
        setIsExporting(false);
      }
    }, 1500);
  };

  // Handle file input change for import
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        // Validate the imported data (simple check)
        if (!jsonData.products || !jsonData.categories) {
          throw new Error("Invalid backup file format");
        }
        
        // Store the imported data in localStorage
        if (jsonData.products) localStorage.setItem("products", JSON.stringify(jsonData.products));
        if (jsonData.categories) localStorage.setItem("categories", JSON.stringify(jsonData.categories));
        if (jsonData.blogPosts) localStorage.setItem("blogPosts", JSON.stringify(jsonData.blogPosts));
        if (jsonData.amazonSettings) localStorage.setItem("amazonSettings", JSON.stringify(jsonData.amazonSettings));
        if (jsonData.siteSettings) localStorage.setItem("siteSettings", JSON.stringify(jsonData.siteSettings));
        
        toast({
          title: "Import Successful",
          description: "Your database has been imported successfully. Refresh the page to see changes.",
        });
      } catch (error) {
        console.error("Import error:", error);
        toast({
          title: "Import Failed",
          description: "There was an error importing your database. Please check the file format.",
          variant: "destructive",
        });
      } finally {
        setIsImporting(false);
        // Reset the file input
        event.target.value = "";
      }
    };
    
    reader.readAsText(file);
  };

  // Handle database reset
  const handleResetDatabase = () => {
    if (confirm("Are you sure you want to reset the database? This action cannot be undone.")) {
      setIsResetting(true);
      
      // Simulate reset
      setTimeout(() => {
        try {
          // Clear all app data from localStorage
          localStorage.removeItem("products");
          localStorage.removeItem("categories");
          localStorage.removeItem("blogPosts");
          localStorage.removeItem("amazonSettings");
          localStorage.removeItem("siteSettings");
          
          toast({
            title: "Database Reset",
            description: "Your database has been reset successfully. Refresh the page to see changes.",
          });
        } catch (error) {
          console.error("Reset error:", error);
          toast({
            title: "Reset Failed",
            description: "There was an error resetting your database.",
            variant: "destructive",
          });
        } finally {
          setIsResetting(false);
        }
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Settings</h2>
      
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="amazon">Amazon Affiliate</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                Configure general settings for your affiliate website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...siteForm}>
                <form id="site-settings-form" onSubmit={siteForm.handleSubmit(handleSaveSiteSettings)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={siteForm.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={siteForm.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={siteForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Used in SEO meta tags and site header
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={siteForm.control}
                    name="analyticsId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Google Analytics ID (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="G-XXXXXXXXXX" />
                        </FormControl>
                        <FormDescription>
                          For tracking website traffic
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Display Options</h3>
                    
                    <FormField
                      control={siteForm.control}
                      name="enableAffiliateBadges"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Show Affiliate Badges
                            </FormLabel>
                            <FormDescription>
                              Display "Affiliate Link" badges next to product links
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={siteForm.control}
                      name="showPricesWithTax"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Show Prices With Tax
                            </FormLabel>
                            <FormDescription>
                              Include estimated taxes in displayed prices
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={siteForm.control}
                      name="showOutOfStockProducts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Show Out of Stock Products
                            </FormLabel>
                            <FormDescription>
                              Display products that are currently unavailable
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                form="site-settings-form" 
                disabled={isLoading}
                className="w-32"
              >
                {isLoading ? (
                  <>
                    <Settings className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="amazon" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Amazon Affiliate Settings</CardTitle>
              <CardDescription>
                Configure your Amazon Associates account for affiliate link generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Demo Mode</AlertTitle>
                <AlertDescription>
                  In this demo, no real API calls are made. In a production environment, 
                  these settings would be used to connect to the Amazon Product Advertising API.
                </AlertDescription>
              </Alert>
              
              <Form {...amazonForm}>
                <form id="amazon-settings-form" onSubmit={amazonForm.handleSubmit(handleSaveAmazonSettings)} className="space-y-6">
                  <FormField
                    control={amazonForm.control}
                    name="associateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amazon Associate ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="yourname-20" />
                        </FormControl>
                        <FormDescription>
                          Your Amazon Associates tracking ID
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={amazonForm.control}
                      name="apiAccessKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Access Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="•••••••••••••••••" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={amazonForm.control}
                      name="apiSecretKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Secret Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="•••••••••••••••••" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={amazonForm.control}
                    name="marketplace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amazon Marketplace</FormLabel>
                        <div className="grid grid-cols-3 gap-2">
                          {["US", "CA", "UK", "DE", "FR", "ES", "IT", "JP", "AU"].map((country) => (
                            <div key={country} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id={`marketplace-${country}`}
                                value={country}
                                checked={field.value === country}
                                onChange={() => field.onChange(country)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                              />
                              <Label htmlFor={`marketplace-${country}`}>{country}</Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                form="amazon-settings-form" 
                disabled={isLoading}
                className="w-32"
              >
                {isLoading ? (
                  <>
                    <Settings className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="database" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>
                Export, import, or reset your product database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>LocalStorage Demo</AlertTitle>
                <AlertDescription>
                  This demo uses your browser's localStorage to store data. In a production environment,
                  these functions would connect to a real database.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium flex items-center">
                        <Database className="mr-2 h-5 w-5" />
                        Export Database
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Download a backup of your products, categories, and settings
                      </p>
                    </div>
                    <Button onClick={handleExportDatabase} disabled={isExporting}>
                      {isExporting ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <FileJson className="mr-2 h-5 w-5" />
                      Import Database
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                      Restore from a previously exported backup file
                    </p>
                    <div className="flex items-center">
                      <Input
                        type="file"
                        accept=".json"
                        onChange={handleFileInputChange}
                        disabled={isImporting}
                        className="flex-1 mr-2"
                      />
                      <Button disabled={isImporting} className="min-w-24">
                        {isImporting ? (
                          <>
                            <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Import
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4 border-red-200 bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-red-700 flex items-center">
                        <AlertCircle className="mr-2 h-5 w-5" />
                        Reset Database
                      </h3>
                      <p className="text-sm text-red-600 mt-1">
                        Warning: This will delete all your products, categories, and settings
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={handleResetDatabase} 
                      disabled={isResetting}
                    >
                      {isResetting ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        <>
                          Reset Database
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
