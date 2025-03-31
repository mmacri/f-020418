
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadFile } from '@/lib/file-upload';
import { ImageWithFallback } from '@/lib/images';

export interface FileUploadWithPreviewProps {
  onFileChange: (url: string) => void;
  currentImage?: string;
  bucket: 'product-images' | 'category-images' | 'blog-images';
  folder?: string;
  maxSize?: number; // in MB
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  className?: string; // Changed from string to optional string
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
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSize}MB.`);
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WEBP).');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create local preview
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      // Upload to storage
      const { url, error } = await uploadFile(file, {
        bucket,
        folder,
        fileTypes: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        maxSize: maxSize * 1024 * 1024
      });

      if (error) {
        setError(error);
        URL.revokeObjectURL(localPreview);
        setPreview(currentImage || null);
        return;
      }

      // Pass the URL back to the parent component
      onFileChange(url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {preview && (
        <div className={`relative rounded-md overflow-hidden border bg-gray-50 ${aspectRatioClass}`}>
          <ImageWithFallback
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {isUploading && <p className="text-sm text-blue-500">Uploading...</p>}
    </div>
  );
};

export default FileUploadWithPreview;
