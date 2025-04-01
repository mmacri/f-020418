
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Check, Save, Trash, X } from 'lucide-react';
import { UserProfile } from '@/types/social';

interface ProfileSettingsProps {
  profile: UserProfile;
  onSave: (data: Partial<UserProfile>) => Promise<UserProfile | null>;
  onDeleteAccount: () => Promise<boolean>;
  onCancel: () => void;
}

const profileSchema = z.object({
  display_name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
  avatar_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  is_public: z.boolean(),
  newsletter_subscribed: z.boolean()
});

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  onSave,
  onDeleteAccount,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: profile.display_name,
      bio: profile.bio || "",
      avatar_url: profile.avatar_url || "",
      is_public: profile.is_public,
      newsletter_subscribed: profile.newsletter_subscribed
    }
  });
  
  const handleSubmit = async (data: z.infer<typeof profileSchema>) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        const success = await onDeleteAccount();
        if (success) {
          // The user should have been logged out and redirected by now
        }
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your profile information and visibility settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-2 border-2 border-white shadow-md">
                  <AvatarImage 
                    src={form.watch("avatar_url") || undefined} 
                    alt={profile.display_name} 
                  />
                  <AvatarFallback className="text-2xl font-semibold">
                    {profile.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground">Profile Picture</p>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      value={field.value || ""} 
                      placeholder="Tell others about yourself..."
                    />
                  </FormControl>
                  <FormDescription>
                    A short bio that appears on your profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture URL</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="https://example.com/avatar.jpg" />
                  </FormControl>
                  <FormDescription>
                    Enter a URL for your profile picture
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_public"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Public Profile</FormLabel>
                    <FormDescription>
                      Make your profile visible to all users
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
              control={form.control}
              name="newsletter_subscribed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Newsletter</FormLabel>
                    <FormDescription>
                      Receive product updates and news
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="gap-2"
            >
              <X size={16} />
              <span>Cancel</span>
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="gap-2"
            >
              <Save size={16} />
              <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="border-red-200">
          <CardHeader className="text-red-700">
            <CardTitle className="text-red-700">Delete Account</CardTitle>
            <CardDescription className="text-red-600">
              Permanently delete your account and all associated data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This action is irreversible. All your data, posts, and comments will be permanently deleted.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="gap-2"
            >
              <Trash size={16} />
              <span>{isDeleting ? "Deleting..." : "Delete Account"}</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
