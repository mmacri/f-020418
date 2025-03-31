
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';

const BlogSettingsPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [settings, setSettings] = useState({
    moderateComments: true,
    notifyNewComments: true,
    excerptLength: 150,
    defaultAuthor: '',
    defaultFooterNote: '',
  });
  const { toast } = useToast();

  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate saving
    setTimeout(() => {
      localStorage.setItem('blog_settings', JSON.stringify(settings));
      
      setIsLoading(false);
      toast({
        title: 'Settings saved',
        description: 'Blog settings have been updated successfully',
      });
    }, 1000);
  };

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Load settings from localStorage on component mount
  React.useEffect(() => {
    const savedSettings = localStorage.getItem('blog_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Settings</CardTitle>
        <CardDescription>
          Configure how your blog posts and comments are managed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Moderate Comments</Label>
              <p className="text-sm text-muted-foreground">
                Require approval before comments are published
              </p>
            </div>
            <Switch
              checked={settings.moderateComments}
              onCheckedChange={(checked) => handleChange('moderateComments', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for new comments
              </p>
            </div>
            <Switch
              checked={settings.notifyNewComments}
              onCheckedChange={(checked) => handleChange('notifyNewComments', checked)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="excerptLength">Excerpt Length</Label>
            <Input
              id="excerptLength"
              type="number"
              value={settings.excerptLength}
              onChange={(e) => handleChange('excerptLength', parseInt(e.target.value) || 0)}
              min={0}
              max={500}
            />
            <p className="text-xs text-muted-foreground">
              Number of characters to show in post excerpts
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultAuthor">Default Author</Label>
            <Input
              id="defaultAuthor"
              value={settings.defaultAuthor}
              onChange={(e) => handleChange('defaultAuthor', e.target.value)}
              placeholder="Enter default author name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultFooterNote">Default Footer Note</Label>
            <Textarea
              id="defaultFooterNote"
              value={settings.defaultFooterNote}
              onChange={(e) => handleChange('defaultFooterNote', e.target.value)}
              placeholder="Enter a default footer note for blog posts"
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="mt-4"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Blog Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogSettingsPanel;
