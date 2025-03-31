
import { ChartDataItem } from '../types';

// Generate mock chart data for testing
export const generateMockChartData = (days: number = 30): ChartDataItem[] => {
  const result: ChartDataItem[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - i - 1));
    const dateString = date.toISOString().split('T')[0];
    
    // Random data with some trend
    const clicks = Math.floor(Math.random() * 50) + 10;
    const conversions = parseFloat((clicks * (Math.random() * 0.05 + 0.02)).toFixed(1));
    const revenue = parseFloat((conversions * (Math.random() * 10 + 20)).toFixed(2));
    
    result.push({
      date: dateString,
      clicks,
      conversions,
      revenue
    });
  }
  
  return result;
};

// Generate mock traffic source data
export const generateMockSourceData = (): {name: string; value: number}[] => {
  const sources = [
    'Google',
    'Direct',
    'Facebook', 
    'Instagram',
    'Email',
    'Twitter',
    'Referral'
  ];
  
  return sources.map(name => ({
    name,
    value: Math.floor(Math.random() * 100) + 10
  }));
};

// Generate mock product data
export const generateMockProducts = (count: number = 10): any[] => {
  const products = [];
  
  for (let i = 0; i < count; i++) {
    const clicks = Math.floor(Math.random() * 50) + 5;
    products.push({
      id: `prod-${i + 1}`,
      name: `Product ${i + 1}`,
      clicks,
      conversions: parseFloat((clicks * 0.03).toFixed(1)),
      revenue: parseFloat((clicks * 0.03 * 25).toFixed(2))
    });
  }
  
  return products.sort((a, b) => b.clicks - a.clicks);
};
