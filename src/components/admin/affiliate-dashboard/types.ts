
export interface AnalyticsSummary {
  totalClicks: number;
  uniqueProducts: number;
  clicksByDay: Record<string, number>;
  topProducts: Array<{
    productId: string;
    productName: string;
    count: number;
    estimatedConversions?: number;
  }>;
  clicksBySource: Record<string, number>;
  estimatedConversions?: number;
  conversionRate?: number;
  estimatedRevenue?: number;
  dailyPerformance?: {
    date: string;
    clicks: number;
    conversions: number;
    revenue: number;
  }[];
}

export interface ChartDataItem {
  date: string;
  clicks: number;
  conversions: number;
  revenue: number;
  conversionRate?: number;
}

export type PeriodType = '7d' | '30d' | 'all';
export type ChartViewType = 'daily' | 'weekly' | 'monthly';
