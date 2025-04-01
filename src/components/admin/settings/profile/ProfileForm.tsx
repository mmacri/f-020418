
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, updateUserProfile } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { ImageWithFallback } from "@/lib/images/ImageWithFallback";

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  avatar: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: User;
  onProfileUpdate?: (updatedUser: User) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onProfileUpdate }) => {
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
          
          // Call the callback if provided
          if (onProfileUpdate) {
            onProfileUpdate(updatedUser);
          }
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
              <ImageWithFallback 
                src={user.avatar} 
                alt="Profile avatar" 
                className="w-full h-full object-cover"
                fallbackSrc="https://ext.same-assets.com/2651616194/3622592620.jpeg"
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
  );
};

export default ProfileForm;
