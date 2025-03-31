
/**
 * Generate mock analytics data for demonstration
 */
export const generateMockData = (days = 14) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    
    const clicks = Math.floor(Math.random() * 500) + 50;
    const conversions = Math.floor(clicks * (Math.random() * 0.05 + 0.01));
    const revenue = conversions * (Math.random() * 40 + 20);
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      clicks,
      conversions,
      revenue: parseFloat(revenue.toFixed(2))
    });
  }
  
  return data;
};

/**
 * Generate mock traffic source data
 */
export const generateSourceData = () => {
  return [
    { name: 'Direct', value: Math.floor(Math.random() * 300) + 100 },
    { name: 'Organic', value: Math.floor(Math.random() * 500) + 200 },
    { name: 'Social', value: Math.floor(Math.random() * 350) + 150 },
    { name: 'Referral', value: Math.floor(Math.random() * 200) + 80 },
    { name: 'Email', value: Math.floor(Math.random() * 150) + 50 }
  ];
};

/**
 * Generate mock top products data
 */
export const generateTopProductsData = () => {
  return [
    {
      id: 1,
      name: 'Premium Massage Gun',
      clicks: Math.floor(Math.random() * 200) + 100,
      conversions: Math.floor(Math.random() * 20) + 5,
      revenue: parseFloat((Math.random() * 500 + 200).toFixed(2))
    },
    {
      id: 2,
      name: 'Vibrating Foam Roller',
      clicks: Math.floor(Math.random() * 150) + 80,
      conversions: Math.floor(Math.random() * 15) + 3,
      revenue: parseFloat((Math.random() * 350 + 150).toFixed(2))
    },
    {
      id: 3,
      name: 'Resistance Bands Set',
      clicks: Math.floor(Math.random() * 120) + 60,
      conversions: Math.floor(Math.random() * 12) + 2,
      revenue: parseFloat((Math.random() * 250 + 100).toFixed(2))
    },
    {
      id: 4,
      name: 'Compression Leg Sleeves',
      clicks: Math.floor(Math.random() * 100) + 40,
      conversions: Math.floor(Math.random() * 10) + 1,
      revenue: parseFloat((Math.random() * 200 + 80).toFixed(2))
    },
    {
      id: 5,
      name: 'Recovery Slide Sandals',
      clicks: Math.floor(Math.random() * 80) + 30,
      conversions: Math.floor(Math.random() * 8) + 1,
      revenue: parseFloat((Math.random() * 150 + 60).toFixed(2))
    }
  ];
};
