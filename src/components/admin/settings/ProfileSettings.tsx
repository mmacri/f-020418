
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, Save } from "lucide-react";
import { User, updateUserProfile } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  avatar: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileSettingsProps {
  user: User;
}

const ProfileSettings = ({ user }: ProfileSettingsProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
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
  
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default ProfileSettings;
