
/**
 * Browser compatibility polyfills
 * These functions provide fallbacks for Internet Explorer and other older browsers
 */

// Object-fit polyfill for IE (requires object-fit-images library)
export const applyObjectFitPolyfill = () => {
  if (typeof window !== 'undefined') {
    // Check if the browser doesn't support object-fit
    const hasObjectFit = 'objectFit' in document.documentElement.style;
    
    if (!hasObjectFit) {
      const images = document.querySelectorAll('.object-cover, .object-contain');
      
      images.forEach((img: Element) => {
        if (img instanceof HTMLImageElement) {
          // Add background image fallback
          if (img.complete) {
            applyFallback(img);
          } else {
            img.addEventListener('load', () => {
              applyFallback(img);
            });
          }
        }
      });
    }
  }
};

// Helper function to apply object-fit fallback
const applyFallback = (img: HTMLImageElement) => {
  // Get image source and determine which object-fit type is being used
  const src = img.src;
  const objectFit = img.classList.contains('object-cover') ? 'cover' : 'contain';
  
  // Add background image and hide the original img
  const parent = img.parentElement;
  if (parent) {
    parent.style.backgroundImage = `url(${src})`;
    parent.style.backgroundRepeat = 'no-repeat';
    parent.style.position = 'relative';
    
    if (objectFit === 'cover') {
      parent.style.backgroundSize = 'cover';
      parent.style.backgroundPosition = 'center center';
    } else {
      parent.style.backgroundSize = 'contain';
      parent.style.backgroundPosition = 'center center';
    }
    
    // Hide the original image
    img.style.opacity = '0';
  }
};

// Position sticky polyfill for IE
export const applyStickyPolyfill = () => {
  if (typeof window !== 'undefined') {
    const supportsSticky = CSS.supports && CSS.supports('position', 'sticky');
    
    if (!supportsSticky) {
      const stickyElements = document.querySelectorAll('.sticky');
      
      stickyElements.forEach((element) => {
        let currentTop = element.getBoundingClientRect().top;
        const originalTop = currentTop;
        
        const checkPosition = () => {
          currentTop = element.getBoundingClientRect().top;
          if (currentTop <= 0) {
            element.style.position = 'fixed';
            element.style.top = '0';
          } else if (window.scrollY <= originalTop) {
            element.style.position = 'static';
            element.style.top = 'auto';
          }
        };
        
        window.addEventListener('scroll', checkPosition);
        window.addEventListener('resize', checkPosition);
      });
    }
  }
};

// Apply all polyfills
export const initPolyfills = () => {
  if (typeof window !== 'undefined') {
    // Check if browser is IE
    const isIE = !!(document as any).documentMode;
    
    if (isIE) {
      // Apply polyfills only for IE
      applyObjectFitPolyfill();
      applyStickyPolyfill();
      
      // Add IE-specific body class for additional CSS targeting
      document.body.classList.add('is-ie');
    }
  }
};

// Export a function to be used in the App component
export default initPolyfills;
