
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Workflow from '@/components/workflow/Workflow';
import { WorkflowProvider, WorkflowItem } from '@/context/WorkflowContext';
import { useToast } from '@/hooks/use-toast';

// Sample workflow items with auto-completion delays
const autoWorkflowItems: WorkflowItem[] = [
  {
    id: '1',
    title: 'Analyzing Product Data',
    description: 'Gathering and analyzing product information from various sources',
    completed: false,
    completionDelay: 5000 // 5 seconds
  },
  {
    id: '2',
    title: 'Comparing Specifications',
    description: 'Comparing technical specifications with competing products',
    completed: false,
    completionDelay: 7000 // 7 seconds
  },
  {
    id: '3',
    title: 'Reading User Reviews',
    description: 'Analyzing feedback from verified purchasers',
    completed: false,
    completionDelay: 6000 // 6 seconds
  },
  {
    id: '4',
    title: 'Checking Price History',
    description: 'Evaluating historical pricing data to determine value',
    completed: false,
    completionDelay: 4000 // 4 seconds
  },
  {
    id: '5',
    title: 'Generating Recommendation',
    description: 'Creating a final product recommendation based on all data',
    completed: false,
    completionDelay: 8000 // 8 seconds
  }
];

const AutoWorkflowDemo = () => {
  const { toast } = useToast();
  
  const handleWorkflowComplete = () => {
    toast({
      title: "Automated Analysis Complete",
      description: "Our system has completed the automated product analysis"
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Automated Product Analysis</h1>
            <p className="text-gray-600">
              This demonstration shows an automated workflow that progresses through each step of a product analysis.
              Each step will automatically complete after a short delay.
            </p>
          </div>
          
          <WorkflowProvider>
            <Workflow 
              items={autoWorkflowItems} 
              onComplete={handleWorkflowComplete}
              autoStart={true}
            />
          </WorkflowProvider>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AutoWorkflowDemo;
