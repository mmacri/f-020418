
/**
 * Parse image URLs from various formats
 */
export const parseImageUrl = (image: any): string => {
  if (!image) return '';
  
  if (typeof image === 'string') {
    return image;
  }
  
  if (typeof image === 'object') {
    // If it's an object, try to find url, src, or other common properties
    return image.url || image.src || image.imageUrl || image.path || '';
  }
  
  return '';
};

/**
 * Get image dimensions from a URL if possible
 */
export const getImageDimensions = async (url: string): Promise<{width: number; height: number}> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({width: img.width, height: img.height});
    };
    img.onerror = () => {
      resolve({width: 0, height: 0});
    };
    img.src = url;
  });
};

/**
 * Check if an image exists and is accessible
 */
export const checkImageExists = async (url: string): Promise<boolean> => {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking image:', error);
    return false;
  }
};

/**
 * Generate a placeholder image URL
 */
export const generatePlaceholderImage = (
  width: number = 800, 
  height: number = 600, 
  text: string = 'Image Placeholder'
): string => {
  // Use a placeholder service
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
};
