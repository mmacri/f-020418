
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
      <h4 className="text-sm font-medium text-foreground flex items-center border-b border-border/50 pb-1.5">
        Subcategories ({subcategories.length})
      </h4>
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
        {subcategories.map((subcategory) => (
          <div 
            key={subcategory.id} 
            className="flex items-center justify-between p-2 bg-background rounded-md border border-border hover:border-border/80 hover:bg-muted/20 transition-colors"
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
                    className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                    aria-label={`Edit ${subcategory.name}`}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(subcategory)}
                    className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Delete ${subcategory.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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
