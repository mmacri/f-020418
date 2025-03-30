
/**
 * Parse and validate an image URL
 * @param url The image URL to parse and validate
 * @returns Valid image URL or null if invalid
 */
export const parseImageUrl = (url?: string): string | null => {
  if (!url) return null;
  
  try {
    // Remove whitespace
    url = url.trim();
    
    // Check if the URL is empty after trimming
    if (!url) return null;
    
    // Handle relative URLs
    if (url.startsWith('/')) {
      return url;
    }
    
    // Handle data URLs
    if (url.startsWith('data:image/')) {
      return url;
    }
    
    // Handle absolute URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If URL doesn't have a protocol, assume https
    if (!url.includes('://')) {
      return `https://${url}`;
    }
    
    return url;
  } catch (error) {
    console.error('Error parsing image URL:', error);
    return null;
  }
};

/**
 * Validate image dimensions
 * @param file Image file to validate
 * @param minWidth Minimum width in pixels
 * @param minHeight Minimum height in pixels
 * @param maxWidth Maximum width in pixels
 * @param maxHeight Maximum height in pixels
 * @returns Promise resolving to validation result
 */
export const validateImageDimensions = (
  file: File,
  minWidth = 0,
  minHeight = 0,
  maxWidth = Infinity,
  maxHeight = Infinity
): Promise<{ valid: boolean; message?: string }> => {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      if (img.width < minWidth || img.height < minHeight) {
        resolve({
          valid: false,
          message: `Image dimensions must be at least ${minWidth}x${minHeight} pixels`
        });
        return;
      }
      
      if (img.width > maxWidth || img.height > maxHeight) {
        resolve({
          valid: false,
          message: `Image dimensions cannot exceed ${maxWidth}x${maxHeight} pixels`
        });
        return;
      }
      
      resolve({ valid: true });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        valid: false,
        message: 'Failed to load image for validation'
      });
    };
    
    img.src = objectUrl;
  });
};

/**
 * Validate image file size
 * @param file Image file to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns Validation result
 */
export const validateImageSize = (
  file: File,
  maxSizeMB = 5
): { valid: boolean; message?: string } => {
  const fileSizeMB = file.size / (1024 * 1024);
  
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      message: `File size exceeds ${maxSizeMB}MB limit`
    };
  }
  
  return { valid: true };
};

/**
 * Create an image handler for error handling
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string
) => {
  const img = event.currentTarget;
  img.src = fallbackSrc;
  img.onerror = null; // Prevent infinite error loops
};
