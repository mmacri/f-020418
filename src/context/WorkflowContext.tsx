
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

// Define the workflow item type
export interface WorkflowItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  autoComplete?: boolean; // New property to indicate if this item should auto-complete
  completionDelay?: number; // New property to control delay before auto-completing (in ms)
}

interface WorkflowContextType {
  items: WorkflowItem[];
  currentItemIndex: number;
  setItems: (items: WorkflowItem[]) => void;
  completeCurrentItem: () => void;
  resetWorkflow: () => void;
  isComplete: boolean;
  startAutoProgress: () => void;
  stopAutoProgress: () => void;
  isAutoProgressing: boolean;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WorkflowItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isAutoProgressing, setIsAutoProgressing] = useState(false);

  const completeCurrentItem = useCallback(() => {
    if (currentItemIndex >= items.length) return;
    
    const updatedItems = [...items];
    updatedItems[currentItemIndex] = {
      ...updatedItems[currentItemIndex],
      completed: true,
    };
    
    setItems(updatedItems);
    
    // Auto-advance to the next item
    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      setIsComplete(true);
      setIsAutoProgressing(false);
    }
  }, [items, currentItemIndex]);

  const resetWorkflow = useCallback(() => {
    const resetItems = items.map(item => ({
      ...item,
      completed: false,
    }));
    
    setItems(resetItems);
    setCurrentItemIndex(0);
    setIsComplete(false);
    setIsAutoProgressing(false);
  }, [items]);

  const startAutoProgress = useCallback(() => {
    setIsAutoProgressing(true);
  }, []);

  const stopAutoProgress = useCallback(() => {
    setIsAutoProgressing(false);
  }, []);

  // Handle auto-progression through workflow items
  useEffect(() => {
    if (!isAutoProgressing || isComplete) return;
    
    const currentItem = items[currentItemIndex];
    if (!currentItem) return;
    
    const delay = currentItem.completionDelay || 3000; // Default 3 seconds if not specified

    const timer = setTimeout(() => {
      completeCurrentItem();
    }, delay);
    
    return () => clearTimeout(timer);
  }, [isAutoProgressing, currentItemIndex, items, completeCurrentItem, isComplete]);

  return (
    <WorkflowContext.Provider
      value={{
        items,
        currentItemIndex,
        setItems,
        completeCurrentItem,
        resetWorkflow,
        isComplete,
        startAutoProgress,
        stopAutoProgress,
        isAutoProgressing,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = (): WorkflowContextType => {
  const context = useContext(WorkflowContext);
  
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  
  return context;
};
