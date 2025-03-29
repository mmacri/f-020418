
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AffiliateDashboard from './AffiliateDashboard';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="affiliate">
        <TabsList>
          <TabsTrigger value="affiliate">Affiliate Performance</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Analytics</TabsTrigger>
          <TabsTrigger value="general">General Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="affiliate" className="pt-6">
          <AffiliateDashboard />
        </TabsContent>
        
        <TabsContent value="traffic" className="pt-6">
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium mb-4">Traffic Analytics Coming Soon</h3>
            <p className="text-gray-600">
              We're working on comprehensive traffic analytics to help you understand user behavior on your site.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="general" className="pt-6">
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium mb-4">General Stats Coming Soon</h3>
            <p className="text-gray-600">
              Overall site performance metrics and insights will be available here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
