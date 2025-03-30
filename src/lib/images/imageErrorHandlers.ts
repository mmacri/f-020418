
/**
 * Handle image loading errors by replacing with a fallback image
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string
) => {
  const img = event.currentTarget;
  img.src = fallbackSrc;
  img.onerror = null; // Prevent infinite error loops
};

/**
 * Log image loading errors for analytics and debugging
 */
export const logImageError = (
  imageUrl: string, 
  context: string
) => {
  console.error(`Image load failed: ${imageUrl} (${context})`);
  
  // In a real app, you might want to send this to an analytics service
  // Example: analyticsService.logEvent('image_error', { url: imageUrl, context });
};

/**
 * Generate a placeholder background for images that failed to load
 */
export const generatePlaceholderBackground = (
  text: string,
  width: number = 300,
  height: number = 200
): string => {
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Draw background
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, width, height);
  
  // Draw text
  ctx.fillStyle = '#aaaaaa';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text || 'Image not available', width / 2, height / 2);
  
  // Return data URL
  return canvas.toDataURL('image/png');
};
