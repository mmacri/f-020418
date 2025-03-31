
export interface ChartDataItem {
  date: string;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  conversionRate: number;
}

export type PeriodType = '7d' | '30d' | '90d' | 'all';

export type ChartViewType = 'daily' | 'weekly' | 'monthly';

export interface AnalyticsSummary {
  totalClicks: number;
  uniqueProducts: number;
  estimatedConversions: number;
  estimatedRevenue: number;
  conversionRate: number;
  topProducts: {
    productId: string;
    productName: string;
    count: number;
    estimatedConversions: number;
  }[];
  clicksByDay: Record<string, number>;
  clicksBySource: Record<string, number>;
}
