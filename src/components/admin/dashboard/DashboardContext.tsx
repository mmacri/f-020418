
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DashboardTimeframe = 'week' | 'month' | 'quarter' | 'year';
export type DashboardView = 'daily' | 'weekly' | 'monthly';

interface DashboardContextType {
  timeframe: DashboardTimeframe;
  setTimeframe: (timeframe: DashboardTimeframe) => void;
  view: DashboardView;
  setView: (view: DashboardView) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  refreshData: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const [timeframe, setTimeframe] = useState<DashboardTimeframe>('week');
  const [view, setView] = useState<DashboardView>('daily');
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = () => {
    // This function will be called when data needs to be refreshed
    // This is a placeholder that components can override with their implementation
    console.log('Refreshing dashboard data');
  };

  const value = {
    timeframe,
    setTimeframe,
    view,
    setView,
    isLoading,
    setIsLoading,
    refreshData
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
