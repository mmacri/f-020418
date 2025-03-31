
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from 'lucide-react';
import { PeriodType } from './types';

interface ClearDataButtonProps {
  onClear: (type: 'current' | 'all') => void;
  isAlertOpen: boolean;
  setIsAlertOpen: (open: boolean) => void;
  clearPeriod: 'current' | 'all';
  period: PeriodType;
  onConfirmClear: () => void;
}

const ClearDataButton: React.FC<ClearDataButtonProps> = ({ 
  onClear, 
  isAlertOpen, 
  setIsAlertOpen, 
  clearPeriod, 
  period, 
  onConfirmClear 
}) => {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 flex items-center gap-1">
            <Trash2 className="h-4 w-4" />
            Clear Data
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48">
          <div className="flex flex-col space-y-1">
            <Button variant="ghost" size="sm" onClick={() => onClear('current')} className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700">
              Current Period
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onClear('all')} className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700">
              All Data
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Analytics Data</AlertDialogTitle>
            <AlertDialogDescription>
              {clearPeriod === 'all' ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-500 inline-block mr-2" />
                  This will permanently delete <span className="font-bold">all</span> analytics data. This action cannot be undone.
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-500 inline-block mr-2" />
                  This will clear data for the {period === '7d' ? 'last 7 days' : period === '30d' ? 'last 30 days' : 'selected date range'}. This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmClear} className="bg-red-600 hover:bg-red-700">
              Yes, Clear Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClearDataButton;
