
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
