
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Workflow from '@/components/workflow/Workflow';
import { WorkflowProvider, WorkflowItem } from '@/context/WorkflowContext';

// Sample workflow items
const demoWorkflowItems: WorkflowItem[] = [
  {
    id: '1',
    title: 'Review Product Information',
    description: 'Carefully read all product details and specifications',
    completed: false
  },
  {
    id: '2',
    title: 'Check Pricing and Availability',
    description: 'Verify the product price and if it\'s in stock',
    completed: false
  },
  {
    id: '3',
    title: 'Read Customer Reviews',
    description: 'Review what other customers are saying about this product',
    completed: false
  },
  {
    id: '4',
    title: 'Compare with Alternatives',
    description: 'Check how this product compares to similar options',
    completed: false
  },
  {
    id: '5',
    title: 'Make Purchase Decision',
    description: 'Decide whether to purchase the product based on your research',
    completed: false
  }
];

const WorkflowDemo = () => {
  const handleWorkflowComplete = () => {
    console.log('Workflow complete! You could redirect or show a special component here.');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Evaluation Workflow</h1>
            <p className="text-gray-600">
              Follow this guided workflow to thoroughly evaluate a product before making a purchase decision.
              Each step will automatically advance to the next after completion.
            </p>
          </div>
          
          <WorkflowProvider>
            <Workflow 
              items={demoWorkflowItems} 
              onComplete={handleWorkflowComplete}
            />
          </WorkflowProvider>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkflowDemo;
