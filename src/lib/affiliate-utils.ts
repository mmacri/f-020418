
import { localStorageKeys } from './constants';
import { toast } from '@/hooks/use-toast';
import { trackAffiliateClick } from './analytics-utils';

interface AffiliateClick {
  productId: string | number;
  productName: string;
  timestamp: number;
  asin?: string;
}

/**
 * Track affiliate link clicks
 * @deprecated Use trackAffiliateClick from analytics-utils.ts instead
 */
export const trackAffiliateClick = (
  productId: string | number, 
  productName: string,
  asin?: string
): void => {
  try {
    // Get existing clicks from localStorage
    const existingData = localStorage.getItem(localStorageKeys.AFFILIATE_CLICKS);
    const clicks: AffiliateClick[] = existingData ? JSON.parse(existingData) : [];
    
    // Add new click
    clicks.push({
      productId,
      productName,
      timestamp: Date.now(),
      asin
    });
    
    // Store back in localStorage
    localStorage.setItem(localStorageKeys.AFFILIATE_CLICKS, JSON.stringify(clicks));
    
    // Log for analytics purposes
    console.log(`Affiliate link clicked: ${productName}`);
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
  }
};

/**
 * Handle affiliate link click with enhanced UX
 */
export const handleAffiliateClick = (
  url: string, 
  productId: string | number, 
  productName: string,
  asin?: string,
  source: string = window.location.pathname
): void => {
  // Track the click using the new analytics system
  import('./analytics-utils').then(({ trackAffiliateClick: trackClick }) => {
    trackClick(productId, productName, url, source, asin);
  });
  
  // For backward compatibility
  trackAffiliateClick(productId, productName, asin);
  
  // Open link in new tab
  window.open(url, '_blank');
  
  // Show toast notification
  toast({
    title: "Opening Amazon",
    description: "You're being redirected to complete your purchase. Thanks for your support!"
  });
};

/**
 * Get affiliate purchase countdown timer data
 */
export const getAffiliateCookieInfo = (): { 
  active: boolean; 
  hoursRemaining: number; 
  minutesRemaining: number;
} => {
  try {
    const existingData = localStorage.getItem(localStorageKeys.AFFILIATE_CLICKS);
    if (!existingData) {
      return { active: false, hoursRemaining: 0, minutesRemaining: 0 };
    }
    
    const clicks: AffiliateClick[] = JSON.parse(existingData);
    if (clicks.length === 0) {
      return { active: false, hoursRemaining: 0, minutesRemaining: 0 };
    }
    
    // Get most recent click
    const mostRecent = clicks.reduce((latest, click) => 
      click.timestamp > latest.timestamp ? click : latest, clicks[0]);
      
    // Amazon affiliate cookies typically last 24 hours
    const cookieLifetimeMs = 24 * 60 * 60 * 1000; 
    const expiryTime = mostRecent.timestamp + cookieLifetimeMs;
    const now = Date.now();
    
    if (now > expiryTime) {
      return { active: false, hoursRemaining: 0, minutesRemaining: 0 };
    }
    
    const remainingMs = expiryTime - now;
    const hoursRemaining = Math.floor(remainingMs / (60 * 60 * 1000));
    const minutesRemaining = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
    
    return { 
      active: true, 
      hoursRemaining, 
      minutesRemaining 
    };
  } catch (error) {
    console.error('Error getting affiliate cookie info:', error);
    return { active: false, hoursRemaining: 0, minutesRemaining: 0 };
  }
};
