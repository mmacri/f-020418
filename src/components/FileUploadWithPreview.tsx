
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadFile } from '@/lib/file-upload';
import { ImageWithFallback } from '@/lib/images';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface FileUploadWithPreviewProps {
  onFileChange: (url: string) => void;
  currentImage?: string;
  bucket: 'product-images' | 'category-images' | 'blog-images';
  folder?: string;
  maxSize?: number; // in MB
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  className?: string;
}

const FileUploadWithPreview: React.FC<FileUploadWithPreviewProps> = ({
  onFileChange,
  currentImage,
  bucket,
  folder = 'uploads',
  maxSize = 2,
  aspectRatio = 'square',
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Set initial preview based on currentImage prop
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSize}MB.`);
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSize}MB.`,
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WEBP).');
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, GIF, or WEBP image.",
        variant: "destructive",
      });
      return;
    }

    setError(null);
    setIsUploading(true);
    setProgress(10); // Start progress

    try {
      // Create local preview immediately for better UX
      const localPreviewUrl = URL.createObjectURL(file);
      setPreview(localPreviewUrl);
      setProgress(30); // Update progress

      // Upload to storage
      console.log(`Uploading file to bucket: ${bucket}, folder: ${folder}`);
      toast({
        title: "Uploading image",
        description: "Your image is being uploaded...",
      });

      const { url, error } = await uploadFile(file, {
        bucket,
        folder,
        fileTypes: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        maxSize: maxSize * 1024 * 1024
      });

      setProgress(90); // Almost done

      if (error) {
        setError(error);
        toast({
          title: "Upload failed",
          description: error,
          variant: "destructive",
        });
        // Clean up the object URL to avoid memory leaks
        URL.revokeObjectURL(localPreviewUrl);
        setPreview(currentImage || null);
        return;
      }

      console.log('File uploaded successfully:', url);
      
      // Clean up the object URL to avoid memory leaks
      URL.revokeObjectURL(localPreviewUrl);
      
      // Update the preview with the actual remote URL
      setPreview(url);
      setProgress(100); // Done
      
      toast({
        title: "Upload complete",
        description: "Your image was uploaded successfully.",
      });

      // Pass the URL back to the parent component
      onFileChange(url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 1000); // Keep progress visible briefly
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const aspectRatioClass = 
    aspectRatio === 'landscape' ? 'aspect-video' : 
    aspectRatio === 'portrait' ? 'aspect-[3/4]' : 
    'aspect-square';

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="image-upload">Upload Image</Label>
        <Input
          ref={fileInputRef}
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        {error && (
          <div className="flex items-center text-sm text-red-500 mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="w-full space-y-1">
          <div className="bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-blue-600 mt-1 flex items-center">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Uploading... {progress}%
          </p>
        </div>
      )}

      {preview && (
        <div className="space-y-2">
          <div className={`relative rounded-md overflow-hidden border bg-gray-50 ${aspectRatioClass}`}>
            <ImageWithFallback
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearPreview} 
            type="button"
            className="mt-2"
            disabled={isUploading}
          >
            Clear Preview
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploadWithPreview;
