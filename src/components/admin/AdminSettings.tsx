
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, getCurrentUser } from "@/services/userService";
import { 
  SlidersHorizontal, 
  KeyRound, 
  User as UserIcon, 
  BookOpen,
  Image
} from "lucide-react";
import HeroImageSettings from "./HeroImageSettings";
import ImageSettingsPanel from "./ImageSettingsPanel";
import BlogSettingsPanel from "./blog/BlogSettingsPanel";
import { ProfileSettings, PasswordSettings, PreferencesSettings } from "./settings";

const AdminSettings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Load user data
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);
  
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
          <ProfileSettings user={user} />
        </TabsContent>
        
        {/* Password Tab */}
        <TabsContent value="password" className="space-y-6">
          <PasswordSettings user={user} />
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
          <PreferencesSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
