
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WorkflowProgress } from './WorkflowProgress';
import { useWorkflow, WorkflowItem } from '@/context/WorkflowContext';
import { useToast } from '@/hooks/use-toast';

interface WorkflowProps {
  items: WorkflowItem[];
  onComplete?: () => void;
  className?: string;
}

const Workflow: React.FC<WorkflowProps> = ({ 
  items, 
  onComplete,
  className 
}) => {
  const { setItems, currentItemIndex, completeCurrentItem, resetWorkflow, isComplete } = useWorkflow();
  const { toast } = useToast();
  const currentItem = items[currentItemIndex];

  useEffect(() => {
    setItems(items);
  }, [items, setItems]);

  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
      toast({
        title: "Workflow Complete",
        description: "All tasks have been completed successfully."
      });
    }
  }, [isComplete, onComplete, toast]);

  return (
    <div className={className}>
      <div className="mb-8">
        <WorkflowProgress />
      </div>
      
      {!isComplete ? (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-xl font-semibold mb-2">{currentItem?.title}</h3>
          <p className="text-gray-600 mb-6">{currentItem?.description}</p>
          
          <div className="flex justify-end">
            <Button 
              onClick={completeCurrentItem}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Complete & Continue
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
          <h3 className="text-xl font-semibold mb-2 text-green-700">All Tasks Completed!</h3>
          <p className="text-gray-600 mb-6">You've successfully completed all tasks in this workflow.</p>
          
          <Button 
            onClick={resetWorkflow}
            variant="outline"
          >
            Start Over
          </Button>
        </div>
      )}
    </div>
  );
};

export default Workflow;
