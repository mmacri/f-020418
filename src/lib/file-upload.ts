
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface UploadOptions {
  bucket?: string;
  folder?: string;
  fileTypes?: string[];
  maxSize?: number;
}

export const uploadFile = async (
  file: File,
  options: UploadOptions = {}
): Promise<{ url: string; error: string | null }> => {
  try {
    const {
      bucket = 'product-images',
      folder = '',
      fileTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      maxSize = 5 * 1024 * 1024 // 5MB default
    } = options;

    // Validate file type
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    if (!fileTypes.includes(fileExt)) {
      return {
        url: '',
        error: `Invalid file type. Allowed types: ${fileTypes.join(', ')}`
      };
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return {
        url: '',
        error: `File size exceeds the ${maxSizeMB}MB limit`
      };
    }

    // Create a unique file name
    const uniqueFileName = `${uuidv4()}.${fileExt}`;
    const filePath = folder 
      ? `${folder}/${uniqueFileName}`
      : uniqueFileName;

    console.log(`Uploading file to ${bucket}/${filePath}`);

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return {
        url: '',
        error: error.message
      };
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('File uploaded successfully:', publicUrl);

    return {
      url: publicUrl,
      error: null
    };
  } catch (error) {
    console.error('File upload error:', error);
    return {
      url: '',
      error: 'An unexpected error occurred during file upload'
    };
  }
};
