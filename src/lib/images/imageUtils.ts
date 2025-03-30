
/**
 * Parse an image URL to ensure it's valid
 */
export const parseImageUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  
  // Check if the URL is already valid
  try {
    new URL(url);
    return url;
  } catch (e) {
    // Not a valid URL
    
    // Check if it's a relative path that needs to be converted
    if (url.startsWith('/')) {
      return `${window.location.origin}${url}`;
    }
    
    // Check if it's missing http/https
    if (!url.startsWith('http')) {
      return `https://${url}`;
    }
  }
  
  return url;
};

/**
 * Get an image's dimensions
 */
export const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
};

/**
 * Check if an image URL exists and is loadable
 */
export const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * Generate a colored placeholder image with text
 */
export const generatePlaceholderImage = (
  text: string = 'No Image',
  width: number = 300,
  height: number = 200,
  bgColor: string = '#f0f0f0',
  textColor: string = '#666666'
): string => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Add text
  ctx.fillStyle = textColor;
  ctx.font = `${Math.floor(width/20)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width/2, height/2);
  
  // Return as data URL
  return canvas.toDataURL('image/png');
};
