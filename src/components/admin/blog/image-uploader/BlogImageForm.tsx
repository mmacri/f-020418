
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import { uploadFile } from '@/lib/file-upload';
import { useToast } from '@/hooks/use-toast';

interface BlogImageFormProps {
  mode: 'upload' | 'url';
  imageUrl: string;
  onUrlChange: (url: string) => void;
  onUploadSuccess?: (url: string) => void;
  onSubmit?: () => void;
}

const BlogImageForm: React.FC<BlogImageFormProps> = ({
  mode,
  imageUrl,
  onUrlChange,
  onUploadSuccess,
  onSubmit
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file (only allow images)
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const { url, error } = await uploadFile(file, {
        bucket: 'blog-images',
        folder: 'posts',
        fileTypes: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        maxSize: 2 * 1024 * 1024 // 2MB
      });
      
      if (error) {
        setUploadError(error);
        toast({
          title: 'Upload failed',
          description: error,
          variant: 'destructive'
        });
        return;
      }
      
      onUrlChange(url);
      if (onUploadSuccess) {
        onUploadSuccess(url);
      }
      
      toast({
        title: 'Image uploaded',
        description: 'Your image has been uploaded successfully'
      });
    } catch (error) {
      console.error('Image upload error:', error);
      setUploadError('Failed to upload image. Please try again.');
      toast({
        title: 'Upload error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  if (mode === 'upload') {
    return (
      <div className="space-y-2">
        <Label htmlFor="image-upload">Upload Image</Label>
        <div className="flex items-center gap-2">
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="flex-grow"
          />
          {isUploading ? (
            <Button disabled variant="outline" size="icon">
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
          )}
        </div>
        {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
        {isUploading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Uploading...</span>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <Label htmlFor="image-url">Image URL</Label>
      <div className="flex gap-2">
        <Input
          id="image-url"
          type="url"
          value={imageUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="flex-grow"
        />
        <Button 
          type="button" 
          variant="default" 
          onClick={onSubmit}
          disabled={!imageUrl}
        >
          Use This URL
        </Button>
      </div>
    </div>
  );
};

export default BlogImageForm;
