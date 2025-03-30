
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface UploadOptions {
  bucket: 'product-images' | 'category-images' | 'blog-images';
  folder?: string;
  fileTypes?: string[];
  maxSize?: number; // in bytes
}

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async (
  file: File, 
  options: UploadOptions
): Promise<{ url: string; error: string | null }> => {
  if (!file) {
    return { url: '', error: 'No file provided' };
  }
  
  // Validate file type if fileTypes is provided
  if (options.fileTypes && options.fileTypes.length > 0) {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    if (!options.fileTypes.includes(`.${fileExt}`) && !options.fileTypes.includes(fileExt)) {
      return { 
        url: '', 
        error: `File type not supported. Supported types: ${options.fileTypes.join(', ')}` 
      };
    }
  }
  
  // Validate file size if maxSize is provided
  if (options.maxSize && file.size > options.maxSize) {
    const maxSizeMB = Math.round(options.maxSize / (1024 * 1024) * 10) / 10;
    return { 
      url: '', 
      error: `File size exceeds maximum allowed size (${maxSizeMB}MB)` 
    };
  }
  
  // Generate a unique file name to avoid conflicts
  const fileExt = file.name.split('.').pop();
  const folder = options.folder ? `${options.folder}/` : '';
  const fileName = `${folder}${uuidv4()}.${fileExt}`;
  
  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from(options.bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error('Error uploading file:', error);
    return { url: '', error: error.message };
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(options.bucket)
    .getPublicUrl(data.path);
  
  return { url: publicUrl, error: null };
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFile = async (
  url: string,
  bucket: 'product-images' | 'category-images' | 'blog-images'
): Promise<{ success: boolean; error: string | null }> => {
  // Extract file path from URL
  // Example URL: https://gsantprpdytoyzmearrb.supabase.co/storage/v1/object/public/product-images/folder/file.jpg
  const urlParts = url.split(`/${bucket}/`);
  if (urlParts.length < 2) {
    return { success: false, error: 'Invalid file URL' };
  }
  
  const filePath = urlParts[1];
  
  // Delete file from Supabase Storage
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);
  
  if (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, error: null };
};
