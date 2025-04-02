
/**
 * Optimizes images before upload by resizing and compressing them
 */

/**
 * Maximum image dimensions for different types
 */
export const MAX_DIMENSIONS = {
  product: { width: 1200, height: 1200 },
  category: { width: 800, height: 600 },
  blog: { width: 1600, height: 900 },
  hero: { width: 1920, height: 600 },
  default: { width: 1200, height: 1200 }
};

/**
 * Optimal quality settings for different image types
 */
export const QUALITY_SETTINGS = {
  product: 0.85,
  category: 0.85,
  blog: 0.85, 
  hero: 0.85,
  default: 0.85
};

/**
 * Optimizes an image by resizing and compressing it before upload
 * @param file Original file to optimize
 * @param type Image type for dimension constraints
 * @returns Promise that resolves to an optimized Blob
 */
export const optimizeImage = async (
  file: File,
  type: 'product' | 'category' | 'blog' | 'hero' = 'product'
): Promise<Blob> => {
  // Skip optimization for small files and SVGs
  if (file.size < 50 * 1024 || file.type === 'image/svg+xml') {
    console.log('Skipping optimization for small file or SVG');
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      // Use type-safe access to the dimensions
      const dimensions = MAX_DIMENSIONS[type] || MAX_DIMENSIONS.product;
      const quality = QUALITY_SETTINGS[type] || QUALITY_SETTINGS.product;
      
      // Calculate new dimensions while preserving aspect ratio
      let newWidth = img.width;
      let newHeight = img.height;
      
      // Only resize if the image is larger than the maximum dimensions
      if (img.width > dimensions.width || img.height > dimensions.height) {
        if (img.width / img.height > dimensions.width / dimensions.height) {
          // Width is the limiting factor
          newWidth = dimensions.width;
          newHeight = Math.floor(img.height * (dimensions.width / img.width));
        } else {
          // Height is the limiting factor
          newHeight = dimensions.height;
          newWidth = Math.floor(img.width * (dimensions.height / img.height));
        }
      }
      
      // Create canvas and resize image
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get canvas context');
        resolve(file); // Fall back to original file
        return;
      }
      
      // Draw image on canvas with smooth interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Convert to blob with appropriate format
      const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Failed to create blob from canvas');
            resolve(file); // Fall back to original file
            return;
          }
          
          console.log(`Optimized image: ${file.size / 1024}KB → ${blob.size / 1024}KB`);
          resolve(blob);
        },
        outputFormat,
        quality
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      console.error('Failed to load image for optimization');
      resolve(file); // Fall back to original file
    };
    
    img.src = objectUrl;
  });
};

/**
 * Determines if an image needs optimization
 * @param file File to check
 * @returns Boolean indicating if optimization should be applied
 */
export const shouldOptimizeImage = (file: File): boolean => {
  // Skip optimization for small files and SVGs
  if (file.size < 50 * 1024 || file.type === 'image/svg+xml') {
    return false;
  }
  
  // Always optimize larger files
  return true;
};
