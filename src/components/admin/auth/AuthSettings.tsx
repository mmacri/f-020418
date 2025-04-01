
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Save, RefreshCw, AlertTriangle, Info, Check, X } from 'lucide-react';

interface SettingsState {
  emailVerification: boolean;
  passwordComplexity: 'low' | 'medium' | 'high';
  sessionTimeout: number;
  maxLoginAttempts: number;
  allowSocialLogin: boolean;
  allowUserRegistration: boolean;
  defaultUserRole: 'user' | 'editor';
  cookieLifetime: number;
  autoLogout: boolean;
  requireMFA: boolean;
}

const defaultSettings: SettingsState = {
  emailVerification: true,
  passwordComplexity: 'medium',
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  allowSocialLogin: false,
  allowUserRegistration: true,
  defaultUserRole: 'user',
  cookieLifetime: 14,
  autoLogout: false,
  requireMFA: false
};

const passwordComplexityDescriptions = {
  low: "At least 6 characters",
  medium: "At least 8 characters, including uppercase and number",
  high: "At least 10 characters, including uppercase, number, and special character"
};

const AuthSettings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Authentication settings saved successfully");
      setIsSaving(false);
      
      // In a real application, you would save settings to a database
      // saveSettingsToDatabase(settings);
    }, 1000);
  };
  
  const handleResetToDefaults = () => {
    setSettings(defaultSettings);
    toast.info("Settings reset to defaults. Click Save Changes to apply.");
  };
  
  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
        <Info className="h-4 w-4" />
        <AlertTitle>Authentication Configuration</AlertTitle>
        <AlertDescription>
          These settings affect how users sign in and account security. Some changes may require users to sign in again.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Configure password requirements and account verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="emailVerification">Email Verification</Label>
              <p className="text-sm text-muted-foreground">
                Require users to verify email address
              </p>
            </div>
            <Switch
              id="emailVerification"
              checked={settings.emailVerification}
              onCheckedChange={(checked) => updateSetting('emailVerification', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="passwordComplexity">Password Complexity</Label>
            <Select
              value={settings.passwordComplexity}
              onValueChange={(value) => updateSetting('passwordComplexity', value as 'low' | 'medium' | 'high')}
            >
              <SelectTrigger id="passwordComplexity">
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {passwordComplexityDescriptions[settings.passwordComplexity]}
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
            <Input
              id="maxLoginAttempts"
              type="number"
              min={1}
              max={10}
              value={settings.maxLoginAttempts}
              onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground">
              Number of failed attempts before temporary lockout
            </p>
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="requireMFA">Require MFA for Admins</Label>
              <p className="text-sm text-muted-foreground">
                Enforce Multi-Factor Authentication for administrator accounts
              </p>
            </div>
            <Switch
              id="requireMFA"
              checked={settings.requireMFA}
              onCheckedChange={(checked) => updateSetting('requireMFA', checked)}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>
            Configure session timeouts and authentication behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              min={5}
              max={1440}
              value={settings.sessionTimeout}
              onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground">
              Time before an inactive session is expired
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="cookieLifetime">Remember Me Duration (days)</Label>
            <Input
              id="cookieLifetime"
              type="number"
              min={1}
              max={90}
              value={settings.cookieLifetime}
              onChange={(e) => updateSetting('cookieLifetime', parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground">
              How long to keep users logged in when "Remember Me" is selected
            </p>
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="autoLogout">Auto Logout on Close</Label>
              <p className="text-sm text-muted-foreground">
                Automatically log users out when they close the browser
              </p>
            </div>
            <Switch
              id="autoLogout"
              checked={settings.autoLogout}
              onCheckedChange={(checked) => updateSetting('autoLogout', checked)}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Registration Settings</CardTitle>
          <CardDescription>
            Configure how new users can register for the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="allowUserRegistration">Allow User Registration</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable self-registration for new users
              </p>
            </div>
            <Switch
              id="allowUserRegistration"
              checked={settings.allowUserRegistration}
              onCheckedChange={(checked) => updateSetting('allowUserRegistration', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="defaultUserRole">Default Role for New Users</Label>
            <Select
              value={settings.defaultUserRole}
              onValueChange={(value) => updateSetting('defaultUserRole', value as 'user' | 'editor')}
              disabled={!settings.allowUserRegistration}
            >
              <SelectTrigger id="defaultUserRole">
                <SelectValue placeholder="Select default role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Regular User</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Role automatically assigned to newly registered users
            </p>
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label htmlFor="allowSocialLogin">Social Login</Label>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Allow users to sign in with social media accounts
              </p>
            </div>
            <Switch
              id="allowSocialLogin"
              checked={settings.allowSocialLogin}
              onCheckedChange={(checked) => updateSetting('allowSocialLogin', checked)}
              disabled={true}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleResetToDefaults}
          >
            <RefreshCw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
      
      <Alert variant="warning" className="bg-yellow-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important Note</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            Some security settings may require users to log in again. Any current sessions may be invalidated.
          </p>
          <div className="flex flex-col space-y-1 mt-2">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" /> Email verification is {settings.emailVerification ? 'enabled' : 'disabled'}
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" /> Password complexity is set to {settings.passwordComplexity}
            </div>
            {settings.requireMFA && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" /> MFA is required for admin accounts
              </div>
            )}
            {!settings.allowUserRegistration && (
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-600" /> User registration is disabled
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AuthSettings;
