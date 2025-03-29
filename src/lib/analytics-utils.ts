import { localStorageKeys } from '@/lib/constants';

export interface ClickEvent {
  productId: string | number;
  productName: string;
  affiliateUrl: string;
  timestamp: number;
  asin?: string;
  source: string; // page or component where click occurred
  userId?: string; // anonymous or logged in user id
  convertedStatus?: 'confirmed' | 'estimated' | 'unknown';
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
 * Get analytics data filtered by date range
 */
export const getAnalyticsInDateRange = (startDate?: Date, endDate?: Date) => {
  try {
    const existingData = localStorage.getItem(localStorageKeys.ANALYTICS_DATA);
    if (!existingData) {
      return { clicks: [] };
    }
    
    const analyticsData: AnalyticsData = JSON.parse(existingData);
    let filteredClicks = [...analyticsData.clicks];
    
    // Apply date filters if provided
    if (startDate) {
      const startTimestamp = startDate.getTime();
      filteredClicks = filteredClicks.filter(click => click.timestamp >= startTimestamp);
    }
    
    if (endDate) {
      const endTimestamp = endDate.getTime() + (24 * 60 * 60 * 1000 - 1); // End of the selected day
      filteredClicks = filteredClicks.filter(click => click.timestamp <= endTimestamp);
    }
    
    return { clicks: filteredClicks };
  } catch (error) {
    console.error('Error getting analytics in date range:', error);
    return { clicks: [] };
  }
};

/**
 * Calculate estimated conversions based on product category and price point
 */
export const calculateEstimatedConversions = (clicks: ClickEvent[], categoryRates?: Record<string, number>) => {
  // Default conversion rates by price point if not specified by category
  const defaultRates = {
    low: 0.032, // 3.2% for products under $25
    medium: 0.028, // 2.8% for products $25-$100
    high: 0.018, // 1.8% for products over $100
    unknown: 0.025 // 2.5% average
  };
  
  // Optional category-specific rates
  const categoryConversionRates = categoryRates || {
    'fitness': 0.035,
    'massage': 0.042,
    'supplements': 0.038,
    'mobility': 0.029,
    'equipment': 0.022
  };
  
  return clicks.length * 0.029; // Using a simplified average rate for now
};

/**
 * Get analytics data summary for dashboard with date range filtering
 */
export const getAnalyticsSummary = (startDate?: Date, endDate?: Date) => {
  try {
    const { clicks } = getAnalyticsInDateRange(startDate, endDate);
    
    if (clicks.length === 0) {
      return {
        totalClicks: 0,
        uniqueProducts: 0,
        clicksByDay: {},
        topProducts: [],
        clicksBySource: {},
        estimatedConversions: 0,
        conversionRate: 0,
        estimatedRevenue: 0
      };
    }
    
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
    const productRevenue: {[key: string]: number} = {};
    
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
          count,
          conversionRate: 0.029, // Default conversion rate
          estimatedConversions: Math.round(count * 0.029 * 10) / 10
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Group clicks by source
    const clicksBySource: {[key: string]: number} = {};
    clicks.forEach(click => {
      clicksBySource[click.source] = (clicksBySource[click.source] || 0) + 1;
    });
    
    // Estimate conversions
    const estimatedConversions = calculateEstimatedConversions(clicks);
    const conversionRate = totalClicks > 0 ? (estimatedConversions / totalClicks) : 0;
    
    return {
      totalClicks,
      uniqueProducts,
      clicksByDay,
      topProducts,
      clicksBySource,
      estimatedConversions,
      conversionRate,
      estimatedRevenue: Math.round(estimatedConversions * 4.5) // Average commission of $4.50 per conversion
    };
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    return {
      totalClicks: 0,
      uniqueProducts: 0,
      clicksByDay: {},
      topProducts: [],
      clicksBySource: {},
      estimatedConversions: 0,
      conversionRate: 0,
      estimatedRevenue: 0
    };
  }
};

/**
 * Mark a click as converted (for when you have confirmation of a sale)
 */
export const markClickAsConverted = (clickId: number): boolean => {
  try {
    const existingData = localStorage.getItem(localStorageKeys.ANALYTICS_DATA);
    if (!existingData) return false;
    
    const analyticsData: AnalyticsData = JSON.parse(existingData);
    
    if (clickId >= 0 && clickId < analyticsData.clicks.length) {
      analyticsData.clicks[clickId].convertedStatus = 'confirmed';
      localStorage.setItem(localStorageKeys.ANALYTICS_DATA, JSON.stringify(analyticsData));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error marking click as converted:', error);
    return false;
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
