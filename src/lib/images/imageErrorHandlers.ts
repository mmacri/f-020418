
/**
 * Handles image loading errors
 * @param imageSrc The source URL of the image that failed to load
 */
export const handleImageError = (imageSrc: string): void => {
  // Log the error for debugging purposes
  logImageError(imageSrc);
};

/**
 * Logs image errors to the console for debugging
 * @param imageSrc The source URL of the image that failed to load
 */
export const logImageError = (imageSrc: string): void => {
  console.warn(`Failed to load image: ${imageSrc}`);
};

/**
 * Generates a placeholder background with initials or a color
 * @param text Text to generate initials from
 * @param index Index for color variation
 * @returns CSS style object for background
 */
export const generatePlaceholderBackground = (text: string = '', index: number = 0): React.CSSProperties => {
  const colors = [
    'rgba(239, 68, 68, 0.2)',   // red
    'rgba(59, 130, 246, 0.2)',  // blue
    'rgba(34, 197, 94, 0.2)',   // green
    'rgba(234, 179, 8, 0.2)',   // yellow
    'rgba(168, 85, 247, 0.2)',  // purple
    'rgba(236, 72, 153, 0.2)',  // pink
  ];

  // Use the index to pick a color, or fall back to a random one if no index provided
  const backgroundColor = colors[index % colors.length];
  
  const initials = text
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');

  return {
    backgroundColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };
};
