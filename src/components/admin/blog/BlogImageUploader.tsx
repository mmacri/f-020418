
import React, { useState } from 'react';
import { uploadFile } from '@/lib/file-upload';
import { ImageWithFallback } from '@/lib/images';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ImagePlus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BlogImageUploaderProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  insertIntoEditor?: (imageUrl: string) => void;
}

const BlogImageUploader: React.FC<BlogImageUploaderProps> = ({
  currentImage,
  onImageChange,
  insertIntoEditor
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(currentImage || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
        return;
      }
      
      setImageUrl(url);
      onImageChange(url);
      
      // Close dialog after successful upload
      if (insertIntoEditor) {
        insertIntoEditor(url);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleUrlSubmit = () => {
    if (imageUrl) {
      onImageChange(imageUrl);
      if (insertIntoEditor) {
        insertIntoEditor(imageUrl);
        setIsDialogOpen(false);
      }
    }
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setIsDialogOpen(true)} 
          className="flex items-center"
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          {insertIntoEditor ? 'Insert Image' : 'Upload Cover Image'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{insertIntoEditor ? 'Insert Image' : 'Upload Blog Image'}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="upload" className="mt-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image-upload">Upload Image</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </div>
              )}
            </div>
            
            {currentImage && (
              <div className="border rounded-md p-2 bg-muted/30">
                <p className="text-sm font-medium mb-2">Current Image:</p>
                <div className="aspect-video bg-muted/20 rounded overflow-hidden">
                  <ImageWithFallback
                    src={currentImage}
                    alt="Current blog image"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="default" 
                onClick={handleUrlSubmit}
                disabled={!imageUrl}
              >
                {insertIntoEditor ? 'Insert' : 'Use This Image'}
              </Button>
            </div>
            
            {imageUrl && (
              <div className="border rounded-md overflow-hidden bg-muted/10">
                <div className="aspect-video bg-muted/20">
                  <ImageWithFallback
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BlogImageUploader;
