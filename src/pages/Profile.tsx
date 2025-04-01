
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, getCurrentUser, updateUserPassword, isAuthenticated, logout } from "@/services/userService";
import { UserCircle, KeyRound, Save, LogOut, Heart } from "lucide-react";
import { ProfileSettings } from "@/components/admin/settings/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Password form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters" }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication required",
        description: "Please log in to access your profile",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, [navigate, toast]);

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

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

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <p>Loading user profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Tabs defaultValue="personal" className="p-6">
              <TabsList className="mb-6">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <UserCircle size={16} />
                  <span>Personal Info</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <KeyRound size={16} />
                  <span>Password & Security</span>
                </TabsTrigger>
                <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                  <Heart size={16} />
                  <span>My Bookmarks</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <ProfileSettings user={user} onProfileUpdate={handleProfileUpdate} />
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
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
                                Password must be at least 8 characters.
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
                            <KeyRound size={16} />
                            <span>{isLoading ? "Updating..." : "Update Password"}</span>
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Login History</CardTitle>
                    <CardDescription>
                      Recent logins to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { date: "Today, 10:15 AM", device: "Chrome on Windows", location: "New York, USA" },
                        { date: "Yesterday, 3:45 PM", device: "Safari on iPhone", location: "New York, USA" },
                        { date: "Jan 15, 2023", device: "Firefox on MacOS", location: "New York, USA" },
                      ].map((login, index) => (
                        <div key={index} className="flex justify-between border-b border-gray-100 pb-3 last:border-0">
                          <div>
                            <p className="font-medium">{login.device}</p>
                            <p className="text-xs text-gray-500">{login.location}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {login.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookmarks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Saved Products</CardTitle>
                    <CardDescription>
                      View and manage your bookmarked products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="py-8 text-center">
                      <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No saved products yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Products you bookmark will appear here for easy access
                      </p>
                      <Button onClick={() => navigate('/products')}>
                        Browse Products
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
