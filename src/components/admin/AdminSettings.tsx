
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, getCurrentUser, updateUserProfile, updateUserPassword } from "@/services/userService";
import { 
  SlidersHorizontal, 
  KeyRound, 
  User as UserIcon, 
  ShieldCheck, 
  Save, 
  RefreshCw,
  BookOpen,
  Image
} from "lucide-react";
import HeroImageSettings from "./HeroImageSettings";
import ImageSettingsPanel from "./ImageSettingsPanel";
import BlogSettingsPanel from "./blog/BlogSettingsPanel";

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  avatar: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
});

// Password form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must include at least one uppercase letter, one lowercase letter, and one number",
    }),
  confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters" }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const AdminSettings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cacheSize, setCacheSize] = useState<string>("0 KB");
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  
  // Load user data
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    
    // Calculate cache size
    calculateCacheSize();
  }, []);
  
  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    },
    values: {
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    },
  });
  
  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
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
  
  // Handle profile form submission
  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    
    try {
      if (user) {
        const updatedUser = await updateUserProfile({
          id: user.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar || undefined,
        });
        
        if (updatedUser) {
          setUser(updatedUser);
          toast({
            title: "Profile updated",
            description: "Your profile has been updated successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password form submission
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    
    try {
      if (user) {
        const success = await updateUserPassword(user.id, data.currentPassword, data.newPassword);
        
        if (success) {
          toast({
            title: "Password updated",
            description: "Your password has been updated successfully",
          });
          passwordForm.reset();
        } else {
          toast({
            title: "Error",
            description: "Current password is incorrect",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear cache
  const handleClearCache = () => {
    const clearedCount = api.clearCache();
    calculateCacheSize();
    
    toast({
      title: "Cache Cleared",
      description: `${clearedCount} cached items have been cleared successfully`,
    });
  };
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Loading user information...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            <span>Password</span>
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Blog</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            <span>Images</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>
      
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account information and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>
                          This is the email address you'll use to log in.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/avatar.jpg" />
                        </FormControl>
                        <FormDescription>
                          Enter a URL for your profile avatar.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {user.avatar && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-2">Current Avatar:</p>
                      <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
                        <img 
                          src={user.avatar} 
                          alt="Profile avatar" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://ext.same-assets.com/2651616194/3622592620.jpeg";
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Role and Permissions</CardTitle>
              <CardDescription>
                View your current role and access level.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 p-3 rounded-md bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-primary">
                    {user.role === "admin" ? "Administrator" : 
                     user.role === "editor" ? "Editor" : "Regular User"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user.role === "admin" ? "Full access to all areas of the platform." : 
                     user.role === "editor" ? "Can manage content but not system settings." : 
                     "Limited access to platform features."}
                  </p>
                </div>
              </div>
              
              {user.role === "admin" && (
                <Alert className="mt-4">
                  <AlertTitle>Admin Account</AlertTitle>
                  <AlertDescription>
                    You have administrator privileges. Be careful when making changes 
                    to system settings and user accounts.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Password Tab */}
        <TabsContent value="password" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="my-4" />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 8 characters and include uppercase, lowercase, and numbers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <KeyRound className="h-4 w-4" />
                      <span>{isLoading ? "Updating..." : "Update Password"}</span>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Blog Tab */}
        <TabsContent value="blog" className="space-y-6">
          <BlogSettingsPanel />
        </TabsContent>
        
        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6">
          <HeroImageSettings />
          <ImageSettingsPanel />
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
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
                  <label className="text-sm font-medium">Use Data Caching</label>
                  <p className="text-xs text-muted-foreground">
                    Enable caching for faster page loads
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Dark Mode</label>
                  <p className="text-xs text-muted-foreground">
                    Use dark theme for the admin dashboard
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Email Notifications</label>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
