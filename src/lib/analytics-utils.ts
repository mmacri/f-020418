
import { localStorageKeys } from '@/lib/constants';

export interface ClickEvent {
  productId: string | number;
  productName: string;
  affiliateUrl: string;
  timestamp: number;
  asin?: string;
  source: string; // page or component where click occurred
  userId?: string; // anonymous or logged in user id
}

export interface AnalyticsData {
  clicks: ClickEvent[];
  lastSync: number;
}

/**
 * Track affiliate link click with extended information
 */
export const trackAffiliateClick = (
  productId: string | number,
  productName: string,
  affiliateUrl: string,
  source: string = 'unknown',
  asin?: string
): void => {
  try {
    // Get user ID if available (from auth)
    const userId = localStorage.getItem(localStorageKeys.USER_ID) || 'anonymous';
    
    // Get existing analytics data from localStorage
    const existingData = localStorage.getItem(localStorageKeys.ANALYTICS_DATA);
    const analyticsData: AnalyticsData = existingData 
      ? JSON.parse(existingData) 
      : { clicks: [], lastSync: 0 };
    
    // Add new click event
    const clickEvent: ClickEvent = {
      productId,
      productName,
      affiliateUrl,
      timestamp: Date.now(),
      asin,
      source,
      userId
    };
    
    analyticsData.clicks.push(clickEvent);
    
    // Store back in localStorage
    localStorage.setItem(localStorageKeys.ANALYTICS_DATA, JSON.stringify(analyticsData));
    
    // Log for debugging
    console.log(`Affiliate link click tracked: ${productName} from ${source}`);
    
    // If server-side tracking is implemented in the future, we could send the data here
    // sendToAnalyticsServer(clickEvent);
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
  }
};

/**
 * Get analytics data summary for dashboard
 */
export const getAnalyticsSummary = () => {
  try {
    const existingData = localStorage.getItem(localStorageKeys.ANALYTICS_DATA);
    if (!existingData) {
      return {
        totalClicks: 0,
        uniqueProducts: 0,
        clicksByDay: {},
        topProducts: [],
        clicksBySource: {}
      };
    }
    
    const analyticsData: AnalyticsData = JSON.parse(existingData);
    const clicks = analyticsData.clicks;
    
    // Calculate total clicks
    const totalClicks = clicks.length;
    
    // Calculate unique products
    const uniqueProducts = new Set(clicks.map(click => click.productId)).size;
    
    // Group clicks by day
    const clicksByDay: {[key: string]: number} = {};
    clicks.forEach(click => {
      const date = new Date(click.timestamp).toISOString().split('T')[0];
      clicksByDay[date] = (clicksByDay[date] || 0) + 1;
    });
    
    // Get top clicked products
    const productCounts: {[key: string]: number} = {};
    clicks.forEach(click => {
      const productKey = `${click.productId}`;
      productCounts[productKey] = (productCounts[productKey] || 0) + 1;
    });
    
    const topProducts = Object.entries(productCounts)
      .map(([productKey, count]) => {
        const [productId] = productKey.split('|');
        const productClick = clicks.find(click => click.productId.toString() === productId);
        return {
          productId,
          productName: productClick?.productName || 'Unknown Product',
          count
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Group clicks by source
    const clicksBySource: {[key: string]: number} = {};
    clicks.forEach(click => {
      clicksBySource[click.source] = (clicksBySource[click.source] || 0) + 1;
    });
    
    return {
      totalClicks,
      uniqueProducts,
      clicksByDay,
      topProducts,
      clicksBySource
    };
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    return {
      totalClicks: 0,
      uniqueProducts: 0,
      clicksByDay: {},
      topProducts: [],
      clicksBySource: {}
    };
  }
};

/**
 * Clear analytics data (for testing or privacy reasons)
 */
export const clearAnalyticsData = (): void => {
  try {
    localStorage.removeItem(localStorageKeys.ANALYTICS_DATA);
    console.log('Analytics data cleared');
  } catch (error) {
    console.error('Error clearing analytics data:', error);
  }
};
