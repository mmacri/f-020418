
/**
 * Browser compatibility polyfills
 * These functions provide fallbacks for Internet Explorer and other older browsers
 */

// Polyfill for CSS properties not supported in IE
const applyCSSSupportPolyfills = () => {
  // Add CSS vars polyfill for IE (cssVars)
  const addCSSVarsPolyfill = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --background-fallback: #ffffff;
        --foreground-fallback: #000000;
        --primary-fallback: #1e293b;
        --primary-foreground-fallback: #f8fafc;
        --secondary-fallback: #f1f5f9;
        --secondary-foreground-fallback: #1e293b;
        --muted-fallback: #f1f5f9;
        --muted-foreground-fallback: #64748b;
        --accent-fallback: #f1f5f9;
        --accent-foreground-fallback: #1e293b;
        --destructive-fallback: #ef4444;
        --destructive-foreground-fallback: #f8fafc;
        --border-fallback: #e2e8f0;
        --input-fallback: #e2e8f0;
        --ring-fallback: #1e293b;
        --radius-fallback: 0.5rem;
      }
    `;
    document.head.appendChild(style);
  };

  // Add fallback for rgba backgrounds in IE
  const addRGBAFallbacks = () => {
    // IE doesn't support rgba colors properly, add fallbacks
    const elementsWithRGBA = document.querySelectorAll('[class*="bg-opacity"]');
    elementsWithRGBA.forEach((element) => {
      if (element instanceof HTMLElement) {
        // Add fallback solid color with filter for opacity 
        element.style.backgroundColor = element.style.backgroundColor || '#ffffff';
        // Add IE-specific filter for opacity
        if (element.style.backgroundColor.includes('rgba')) {
          const opacity = parseFloat(element.style.backgroundColor.split(',')[3]) || 0.8;
          const alphaPercent = Math.round(opacity * 100);
          element.style.filter = `alpha(opacity=${alphaPercent})`;
        }
      }
    });
  };

  if (typeof window !== 'undefined') {
    addCSSVarsPolyfill();
    addRGBAFallbacks();
  }
};

// Object-fit polyfill for IE
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

// Helper function to apply object-fit fallback with error handling for cross-origin images
const applyFallback = (img: HTMLImageElement) => {
  try {
    // Get image source and determine which object-fit type is being used
    const src = img.src;
    const objectFit = img.classList.contains('object-cover') ? 'cover' : 'contain';
    
    // Add background image and hide the original img
    const parent = img.parentElement;
    if (parent) {
      // Use a try-catch to handle potential CORS issues
      try {
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
      } catch (e) {
        console.error('Failed to set background image due to CORS:', e);
        // Fall back to showing the original image
        img.style.opacity = '1';
      }
    }
  } catch (error) {
    console.error('Error applying object-fit fallback:', error);
  }
};

// Position sticky polyfill for IE
export const applyStickyPolyfill = () => {
  if (typeof window !== 'undefined') {
    const supportsSticky = CSS.supports && CSS.supports('position', 'sticky');
    
    if (!supportsSticky) {
      const stickyElements = document.querySelectorAll('.sticky');
      
      stickyElements.forEach((element) => {
        // Cast element to HTMLElement to access style property
        const htmlElement = element as HTMLElement;
        let currentTop = element.getBoundingClientRect().top;
        const originalTop = currentTop;
        
        const checkPosition = () => {
          currentTop = element.getBoundingClientRect().top;
          if (currentTop <= 0) {
            htmlElement.style.position = 'fixed';
            htmlElement.style.top = '0';
          } else if (window.scrollY <= originalTop) {
            htmlElement.style.position = 'static';
            htmlElement.style.top = 'auto';
          }
        };
        
        window.addEventListener('scroll', checkPosition);
        window.addEventListener('resize', checkPosition);
      });
    }
  }
};

// Text-size-adjust polyfill
const applyTextSizeAdjustPolyfill = () => {
  if (typeof window !== 'undefined') {
    // Apply text-size-adjust to html element
    const html = document.documentElement;
    if (html) {
      // Using string indexers to avoid TypeScript errors with vendor prefixes
      (html.style as any)['textSizeAdjust'] = '100%';
      (html.style as any)['-ms-text-size-adjust'] = '100%';
      (html.style as any)['-webkit-text-size-adjust'] = '100%';
    }
  }
};

// Apply IE-specific fixes for grid and flex
const applyIEGridFlexFixes = () => {
  if (typeof window !== 'undefined') {
    // Find all grid elements and apply IE-specific styles
    const gridElements = document.querySelectorAll('.grid');
    gridElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      (htmlElement.style as any)['display'] = '-ms-grid';
      
      // Check for grid columns and apply IE-specific columns
      if (element.classList.contains('grid-cols-1')) {
        (htmlElement.style as any)['-ms-grid-columns'] = '1fr';
      } else if (element.classList.contains('grid-cols-2')) {
        (htmlElement.style as any)['-ms-grid-columns'] = '1fr 1fr';
      } else if (element.classList.contains('grid-cols-3')) {
        (htmlElement.style as any)['-ms-grid-columns'] = '1fr 1fr 1fr';
      } else if (element.classList.contains('grid-cols-4')) {
        (htmlElement.style as any)['-ms-grid-columns'] = '1fr 1fr 1fr 1fr';
      }
    });
    
    // Find all flex elements and apply IE-specific styles
    const flexElements = document.querySelectorAll('.flex');
    flexElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      (htmlElement.style as any)['display'] = '-ms-flexbox';
      
      // Add IE-specific flex direction properties
      if (element.classList.contains('flex-col')) {
        (htmlElement.style as any)['-ms-flex-direction'] = 'column';
      } else if (element.classList.contains('flex-row')) {
        (htmlElement.style as any)['-ms-flex-direction'] = 'row';
      }
      
      // Add IE-specific flex wrap properties
      if (element.classList.contains('flex-wrap')) {
        (htmlElement.style as any)['-ms-flex-wrap'] = 'wrap';
      }
      
      // Add IE-specific flex grow properties
      if (element.classList.contains('flex-grow')) {
        (htmlElement.style as any)['-ms-flex-positive'] = '1';
      }
      
      // Add IE-specific alignment properties
      if (element.classList.contains('items-center')) {
        (htmlElement.style as any)['-ms-flex-align'] = 'center';
      }
      
      if (element.classList.contains('justify-center')) {
        (htmlElement.style as any)['-ms-flex-pack'] = 'center';
      } else if (element.classList.contains('justify-between')) {
        (htmlElement.style as any)['-ms-flex-pack'] = 'justify';
      }
    });
  }
};

// Apply button type attribute fix
const applyButtonTypeFix = () => {
  if (typeof window !== 'undefined') {
    // Find all buttons without type attribute and set to "button"
    const buttons = document.querySelectorAll('button:not([type])');
    buttons.forEach((button) => {
      button.setAttribute('type', 'button');
    });
  }
};

// Apply all polyfills
export const initPolyfills = () => {
  if (typeof window !== 'undefined') {
    // Check if browser is IE or needs compatibility polyfills
    const isIE = !!(document as any).documentMode;
    const isOldEdge = navigator.userAgent.indexOf('Edge/') > -1;
    
    // Apply polyfills for text-size-adjust in all browsers
    applyTextSizeAdjustPolyfill();
    
    // Apply button type fixes in all browsers
    applyButtonTypeFix();
    
    if (isIE || isOldEdge) {
      // Apply polyfills only for IE/old Edge
      applyObjectFitPolyfill();
      applyStickyPolyfill();
      applyCSSSupportPolyfills();
      applyIEGridFlexFixes();
      
      // Add IE-specific body class for additional CSS targeting
      document.body.classList.add('is-ie');
      
      // Load additional polyfills via CDN for IE
      const polyfillScript = document.createElement('script');
      polyfillScript.src = 'https://polyfill.io/v3/polyfill.min.js?features=default,Array.prototype.find,IntersectionObserver,Promise,fetch,Object.assign,CustomEvent';
      document.head.appendChild(polyfillScript);
    }
  }
};

// Export a function to be used in the App component
export default initPolyfills;
