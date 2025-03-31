
import React from 'react';
import { DashboardProvider } from './dashboard/DashboardContext';
import DashboardTabs from './dashboard/DashboardTabs';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <DashboardProvider>
        <DashboardTabs />
      </DashboardProvider>
    </div>
  );
};

export default AdminDashboard;
