
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
  },
  {
    id: '6',
    title: 'Optimizing Content',
    description: 'Finalizing and optimizing the content for the best user experience',
    completed: false,
    completionDelay: 3000 // 3 seconds
  }
];

const projectTasksWorkflow: WorkflowItem[] = [
  {
    id: 'data-1',
    title: 'API Integration',
    description: 'Setting up real API integration to replace mock data services',
    completed: false,
    completionDelay: 6000
  },
  {
    id: 'data-2',
    title: 'Data Persistence Implementation',
    description: 'Implementing data persistence beyond local storage',
    completed: false,
    completionDelay: 7000
  },
  {
    id: 'data-3',
    title: 'Optimizing Caching',
    description: 'Setting up caching for improved performance',
    completed: false,
    completionDelay: 5000
  },
  {
    id: 'admin-1',
    title: 'Rich Text Editor Integration',
    description: 'Adding rich text editing capabilities for content management',
    completed: false,
    completionDelay: 8000
  },
  {
    id: 'admin-2',
    title: 'Media Management System',
    description: 'Building a system to handle media uploads and management',
    completed: false,
    completionDelay: 6000
  },
  {
    id: 'product-1',
    title: 'Reviews & Ratings System',
    description: 'Implementing product reviews and ratings functionality',
    completed: false,
    completionDelay: 7000
  },
  {
    id: 'product-2',
    title: 'Save For Later Feature',
    description: 'Creating wishlist and save for later capabilities',
    completed: false,
    completionDelay: 5000
  },
  {
    id: 'user-1',
    title: 'Loading States & Skeletons',
    description: 'Enhancing user experience with loading indicators',
    completed: false,
    completionDelay: 4000
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Automated Process Demo</h1>
            <p className="text-gray-600">
              This demonstration shows an automated workflow that progresses through each step of a process.
              Each step will automatically complete after a short delay.
            </p>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Product Analysis Workflow</h2>
            <WorkflowProvider>
              <Workflow 
                items={autoWorkflowItems} 
                onComplete={() => toast({
                  title: "Product Analysis Complete",
                  description: "The product analysis workflow has finished successfully."
                })}
                autoStart={true}
              />
            </WorkflowProvider>
          </div>
          
          <div className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">Project Tasks Workflow</h2>
            <WorkflowProvider>
              <Workflow 
                items={projectTasksWorkflow} 
                onComplete={() => toast({
                  title: "Project Tasks Complete",
                  description: "All project tasks have been processed successfully."
                })}
                autoStart={true}
              />
            </WorkflowProvider>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AutoWorkflowDemo;
