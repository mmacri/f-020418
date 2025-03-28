
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WorkflowProgress } from './WorkflowProgress';
import { useWorkflow, WorkflowItem } from '@/context/WorkflowContext';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';

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

  const progressPercentage = items.length > 0 
    ? Math.round(((currentItemIndex + (items[currentItemIndex]?.completed ? 1 : 0)) / items.length) * 100) 
    : 0;

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-500">
          Progress: {progressPercentage}% ({items.filter(item => item.completed).length} of {items.length})
        </div>
        
        {!isComplete && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleAutoProgress}
              className="flex items-center gap-1.5"
            >
              {isAutoProgressing ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Auto-Run
                </>
              )}
            </Button>
            
            <Button 
              onClick={resetWorkflow}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
          </div>
        )}
      </div>
      
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
              disabled={isAutoProgressing}
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete & Continue
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>
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
