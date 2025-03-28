
import React from 'react';
import { Check, Circle, Timer } from 'lucide-react';
import { useWorkflow, WorkflowItem } from '@/context/WorkflowContext';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface WorkflowProgressProps {
  className?: string;
}

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ className }) => {
  const { items, currentItemIndex, isAutoProgressing } = useWorkflow();

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {items.map((item, index) => (
        <div 
          key={item.id} 
          className={cn(
            "flex items-center space-x-3 p-3 rounded-md transition-colors",
            index === currentItemIndex && "bg-indigo-50 border-l-4 border-indigo-500",
            item.completed && "text-gray-500"
          )}
        >
          <div className="flex-shrink-0">
            {item.completed ? (
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                index === currentItemIndex ? "border-indigo-500" : "border-gray-300"
              )}>
                {index === currentItemIndex && (
                  <>
                    {isAutoProgressing ? (
                      <Timer className="w-4 h-4 text-indigo-500 animate-pulse" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex-grow">
            <p className={cn(
              "font-medium",
              item.completed ? "text-gray-500" : index === currentItemIndex ? "text-indigo-700" : "text-gray-700"
            )}>
              {item.title}
            </p>
            <p className="text-sm text-gray-500">{item.description}</p>
            
            {index === currentItemIndex && isAutoProgressing && (
              <div className="mt-2">
                <Progress value={50} className="h-1" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
