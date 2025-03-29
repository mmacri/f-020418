
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubcategoryListProps {
  subcategories: any[];
  onEdit?: (subcategory: any) => void;
  onDelete?: (subcategory: any) => void;
  className?: string;
}

const SubcategoryList = ({ 
  subcategories, 
  onEdit, 
  onDelete, 
  className 
}: SubcategoryListProps) => {
  if (!subcategories || subcategories.length === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground italic", className)}>
        No subcategories
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-sm font-medium text-foreground">Subcategories</h4>
      <div className="space-y-2">
        {subcategories.map((subcategory) => (
          <div 
            key={subcategory.id} 
            className="flex items-center justify-between p-2 bg-muted/50 rounded-md border border-border"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{subcategory.name}</span>
              {subcategory.showInNavigation && (
                <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs">
                  Nav
                </Badge>
              )}
            </div>
            
            {(onEdit || onDelete) && (
              <div className="flex space-x-1">
                {onEdit && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(subcategory)}
                    className="h-7 w-7"
                  >
                    <Edit className="h-3.5 w-3.5 text-primary" />
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(subcategory)}
                    className="h-7 w-7"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubcategoryList;
