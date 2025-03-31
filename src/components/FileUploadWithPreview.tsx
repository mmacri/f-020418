
import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageWithFallback } from '@/lib/images';
import { uploadFile } from '@/lib/file-upload';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface FileUploadWithPreviewProps {
  currentImage?: string;
  onFileChange: (url: string) => void;
  bucket: 'product-images' | 'category-images' | 'blog-images';
  folder?: string;
  maxSize?: number; // in MB
  aspectRatio?: 'square' | 'landscape' | 'portrait';
}

const FileUploadWithPreview: React.FC<FileUploadWithPreviewProps> = ({
  currentImage,
  onFileChange,
  bucket,
  folder,
  maxSize = 2,
  aspectRatio = 'square'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>(currentImage ? 'url' : 'upload');
  const [imageUrl, setImageUrl] = useState<string>(currentImage || '');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    
    if (!file) return;
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds the ${maxSize}MB limit`);
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const { url, error } = await uploadFile(file, {
        bucket,
        folder,
        fileTypes: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        maxSize: maxSize * 1024 * 1024
      });
      
      if (error) {
        setError(error);
        return;
      }
      
      onFileChange(url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleUrlSubmit = () => {
    if (!imageUrl) {
      setError('Please enter an image URL');
      return;
    }
    
    // Simple URL validation
    if (!imageUrl.match(/^https?:\/\/.+\..+/)) {
      setError('Please enter a valid URL');
      return;
    }
    
    setPreview(imageUrl);
    onFileChange(imageUrl);
  };

  const handleRemove = () => {
    setPreview(null);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileChange('');
  };

  const heightClass = 
    aspectRatio === 'square' ? 'h-40' : 
    aspectRatio === 'landscape' ? 'h-32' : 
    'h-48';

  return (
    <div className="space-y-4">
      {/* Upload method selection */}
      <RadioGroup 
        value={uploadMethod} 
        onValueChange={(value: 'upload' | 'url') => setUploadMethod(value)}
        className="flex space-x-4 mb-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="upload" id="upload" />
          <Label htmlFor="upload">Upload File</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="url" id="url" />
          <Label htmlFor="url">Image URL</Label>
        </div>
      </RadioGroup>
      
      {/* Upload file UI */}
      {uploadMethod === 'upload' && (
        <div className="space-y-4">
          {!preview ? (
            <div 
              className={`border-2 border-dashed rounded-md flex flex-col items-center justify-center ${heightClass} p-4 hover:bg-gray-50 cursor-pointer`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload an image</p>
              <p className="text-xs text-gray-400 mt-1">Max size: {maxSize}MB</p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="relative rounded-md overflow-hidden">
              <img 
                src={preview} 
                alt="Preview" 
                className={`w-full object-cover ${heightClass}`}
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-7 w-7 rounded-full"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* URL input UI */}
      {uploadMethod === 'url' && (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={handleUrlChange}
              className="flex-grow"
            />
            <Button onClick={handleUrlSubmit}>
              Apply
            </Button>
          </div>
          
          {preview && (
            <div className="relative rounded-md overflow-hidden">
              <ImageWithFallback 
                src={preview} 
                alt="Preview" 
                className={`w-full object-cover ${heightClass}`}
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-7 w-7 rounded-full"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
      
      {/* Loading state */}
      {isUploading && (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Uploading...</span>
        </div>
      )}
    </div>
  );
};

export default FileUploadWithPreview;
