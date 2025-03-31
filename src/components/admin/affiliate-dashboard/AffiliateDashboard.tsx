
import React from 'react';
import AffiliateStats from './AffiliateStats';
import DashboardHeader from './DashboardHeader';
import DashboardTabs from './DashboardTabs';
import { useAffiliateDashboard } from './hooks/useAffiliateDashboard';
import { formatCurrency } from './utils';

const AffiliateDashboard: React.FC = () => {
  const {
    chartData,
    sourceData,
    topProducts,
    totals,
    isLoading,
    chartView,
    setChartView,
    isAlertOpen,
    setIsAlertOpen,
    clearPeriod,
    dateRange,
    isCustomDateRange,
    currentPeriod,
    handleClearData,
    handleConfirmClear,
    handleExportData,
    handleDateRangeChange,
    handlePeriodChange,
    calculateGrowth
  } = useAffiliateDashboard();

  return (
    <div className="space-y-6">
      <DashboardHeader 
        currentPeriod={currentPeriod}
        dateRange={dateRange}
        isCustomDateRange={isCustomDateRange}
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        clearPeriod={clearPeriod}
        onDateRangeChange={handleDateRangeChange}
        onPeriodChange={handlePeriodChange}
        onExportData={handleExportData}
        onClearData={handleClearData}
        onConfirmClear={handleConfirmClear}
      />

      <AffiliateStats 
        analyticsData={{
          totalClicks: totals.clicks,
          uniqueProducts: topProducts.length,
          estimatedConversions: totals.conversions,
          estimatedRevenue: totals.revenue,
          conversionRate: totals.conversionRate,
          topProducts: topProducts.map(p => ({
            productId: p.id.toString(),
            productName: p.name,
            count: p.clicks,
            estimatedConversions: p.conversions
          })),
          clicksByDay: {},
          clicksBySource: {}
        }}
        calculateGrowth={calculateGrowth}
        formatCurrency={formatCurrency}
      />
      
      <DashboardTabs 
        chartData={chartData}
        sourceData={sourceData}
        topProducts={topProducts}
        totals={totals}
        chartView={chartView}
        setChartView={setChartView}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AffiliateDashboard;
