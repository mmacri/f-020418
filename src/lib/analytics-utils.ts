
import { supabase } from '@/integrations/supabase/client';

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

// Constants for localStorage keys
const LOCAL_STORAGE_KEYS = {
  ANALYTICS_DATA: 'analyticsData'
};

/**
 * Track affiliate link click with Supabase integration
 */
export const trackAffiliateClick = async (
  productId: string | number,
  productName: string,
  affiliateUrl: string,
  source: string = 'unknown',
  asin?: string
): Promise<void> => {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // Insert event into analytics_events table
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: 'affiliate_click',
        page_url: window.location.href,
        user_id: userId,
        data: {
          productId,
          productName,
          affiliateUrl,
          asin,
          source,
          timestamp: Date.now()
        }
      });
    
    if (error) {
      console.error('Error tracking affiliate click in Supabase:', error);
      // Fallback to localStorage if Supabase insertion fails
      saveAnalyticsToLocalStorage(productId, productName, affiliateUrl, source, asin, userId);
    } else {
      console.log(`Affiliate link click tracked in Supabase: ${productName} from ${source}`);
    }
  } catch (error) {
    console.error('Error in trackAffiliateClick:', error);
    // Fallback to localStorage
    saveAnalyticsToLocalStorage(productId, productName, affiliateUrl, source, asin);
  }
};

// Fallback to localStorage if Supabase tracking fails
const saveAnalyticsToLocalStorage = (
  productId: string | number,
  productName: string,
  affiliateUrl: string,
  source: string = 'unknown',
  asin?: string,
  userId?: string
): void => {
  try {
    const localStorageKey = LOCAL_STORAGE_KEYS.ANALYTICS_DATA;
    const existingData = localStorage.getItem(localStorageKey);
    const analyticsData = existingData 
      ? JSON.parse(existingData) 
      : { clicks: [], lastSync: 0 };
    
    analyticsData.clicks.push({
      productId,
      productName,
      affiliateUrl,
      timestamp: Date.now(),
      asin,
      source,
      userId: userId || 'anonymous'
    });
    
    localStorage.setItem(localStorageKey, JSON.stringify(analyticsData));
    console.log(`Affiliate link click fallback to localStorage: ${productName} from ${source}`);
  } catch (error) {
    console.error('Error in localStorage fallback for analytics:', error);
  }
};

interface AnalyticsData {
  clicks: ClickEvent[];
  lastSync: number;
}

/**
 * Get analytics data summary for dashboard
 */
export const getAnalyticsSummary = async (startDate?: Date, endDate?: Date) => {
  try {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .eq('event_type', 'affiliate_click');
    
    // Apply date filters if provided
    if (startDate) {
      const startTimestamp = startDate.toISOString();
      query = query.gte('created_at', startTimestamp);
    }
    
    if (endDate) {
      // Set to end of the selected day
      const endDay = new Date(endDate);
      endDay.setHours(23, 59, 59, 999);
      const endTimestamp = endDay.toISOString();
      query = query.lte('created_at', endTimestamp);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching analytics data:', error);
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
    
    if (!data || data.length === 0) {
      console.log('No analytics data found');
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
    
    // Process the data
    const totalClicks = data.length;
    
    // Extract unique products
    const productIds = new Set();
    const productCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};
    const clicksByDay: Record<string, number> = {};
    
    data.forEach(event => {
      // Handle possible null or non-object data
      if (!event.data || typeof event.data !== 'object') {
        console.warn('Invalid event data found:', event);
        return;
      }
      
      const eventData = event.data as any;
      const productId = eventData.productId;
      
      if (productId) {
        productIds.add(productId.toString());
        
        // Count by product
        const prodIdStr = productId.toString();
        productCounts[prodIdStr] = (productCounts[prodIdStr] || 0) + 1;
      }
      
      // Count by source
      const source = eventData.source || 'unknown';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      
      // Group by day - use created_at from the event record, not from the event data
      if (event.created_at) {
        const day = new Date(event.created_at).toISOString().split('T')[0];
        clicksByDay[day] = (clicksByDay[day] || 0) + 1;
      }
    });
    
    // Calculate top products
    const topProducts = Object.entries(productCounts)
      .map(([productId, count]) => {
        // Find a sample event with this product to get the name
        const sampleEvent = data.find(event => {
          const eventData = event.data as any;
          return eventData && eventData.productId && eventData.productId.toString() === productId;
        });
        
        const eventData = (sampleEvent?.data as any) || {};
        
        return {
          productId,
          productName: eventData.productName || 'Unknown Product',
          count,
          conversionRate: 0.029, // Default conversion rate
          estimatedConversions: Math.round(count * 0.029 * 10) / 10
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Estimate conversions
    const estimatedConversions = totalClicks * 0.029;
    const conversionRate = totalClicks > 0 ? estimatedConversions / totalClicks : 0;
    
    return {
      totalClicks,
      uniqueProducts: productIds.size,
      clicksByDay,
      topProducts,
      clicksBySource: sourceCounts,
      estimatedConversions,
      conversionRate,
      estimatedRevenue: Math.round(estimatedConversions * 4.5) // Average commission of $4.50 per conversion
    };
  } catch (error) {
    console.error('Error in getAnalyticsSummary:', error);
    // Return default empty data structure on error
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
    const existingData = localStorage.getItem(LOCAL_STORAGE_KEYS.ANALYTICS_DATA);
    if (!existingData) return false;
    
    const analyticsData: AnalyticsData = JSON.parse(existingData);
    
    if (clickId >= 0 && clickId < analyticsData.clicks.length) {
      analyticsData.clicks[clickId].convertedStatus = 'confirmed';
      localStorage.setItem(LOCAL_STORAGE_KEYS.ANALYTICS_DATA, JSON.stringify(analyticsData));
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
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ANALYTICS_DATA);
    console.log('Analytics data cleared');
  } catch (error) {
    console.error('Error clearing analytics data:', error);
  }
};
