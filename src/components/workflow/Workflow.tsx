
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WorkflowProgress } from './WorkflowProgress';
import { useWorkflow, WorkflowItem } from '@/context/WorkflowContext';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface WorkflowProps {
  items: WorkflowItem[];
  onComplete?: () => void;
  className?: string;
  autoStart?: boolean;
}

const Workflow: React.FC<WorkflowProps> = ({ 
  items, 
  onComplete,
  className,
  autoStart = false
}) => {
  const { 
    setItems, 
    currentItemIndex, 
    completeCurrentItem, 
    resetWorkflow, 
    isComplete,
    startAutoProgress,
    stopAutoProgress,
    isAutoProgressing
  } = useWorkflow();
  const { toast } = useToast();
  const currentItem = items[currentItemIndex];

  useEffect(() => {
    setItems(items);
    
    // Start auto-progression if autoStart is true
    if (autoStart) {
      startAutoProgress();
    }
  }, [items, setItems, autoStart, startAutoProgress]);

  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
      toast({
        title: "Workflow Complete",
        description: "All tasks have been completed successfully."
      });
    }
  }, [isComplete, onComplete, toast]);

  const handleToggleAutoProgress = () => {
    if (isAutoProgressing) {
      stopAutoProgress();
      toast({
        title: "Auto-progress Paused",
        description: "You can now manually progress through the tasks."
      });
    } else {
      startAutoProgress();
      toast({
        title: "Auto-progress Started",
        description: "Tasks will automatically complete one after another."
      });
    }
  };

  return (
    <div className={className}>
      <div className="mb-8">
        <WorkflowProgress />
      </div>
      
      {!isComplete ? (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-xl font-semibold mb-2">{currentItem?.title}</h3>
          <p className="text-gray-600 mb-6">{currentItem?.description}</p>
          
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleToggleAutoProgress}
              className="flex items-center gap-2"
            >
              {isAutoProgressing ? (
                <>
                  <Pause className="w-4 h-4" /> Pause Auto-Progress
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Start Auto-Progress
                </>
              )}
            </Button>
            
            <Button 
              onClick={completeCurrentItem}
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={isAutoProgressing}
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
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Start Over
          </Button>
        </div>
      )}
    </div>
  );
};

export default Workflow;
