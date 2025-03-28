
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Define the workflow item type
export interface WorkflowItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface WorkflowContextType {
  items: WorkflowItem[];
  currentItemIndex: number;
  setItems: (items: WorkflowItem[]) => void;
  completeCurrentItem: () => void;
  resetWorkflow: () => void;
  isComplete: boolean;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WorkflowItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

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
  }, [items]);

  return (
    <WorkflowContext.Provider
      value={{
        items,
        currentItemIndex,
        setItems,
        completeCurrentItem,
        resetWorkflow,
        isComplete,
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
