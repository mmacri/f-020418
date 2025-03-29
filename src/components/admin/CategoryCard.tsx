
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Edit, Trash2, ArrowUpRight, Layers } from 'lucide-react';
import { ImageWithFallback } from '@/lib/image-utils';
import { SubcategoryList } from '@/components/admin';

interface CategoryCardProps {
  category: any;
  onEdit: (category: any) => void;
  onDelete: (category: any) => void;
}

const CategoryCard = ({ category, onEdit, onDelete }: CategoryCardProps) => {
  return (
    <Card className="border border-border shadow-md hover:shadow-lg transition-shadow bg-card overflow-hidden">
      <CardHeader className="pb-2 bg-muted/30">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-foreground font-bold">{category.name}</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => onEdit(category)}
              className="bg-background/80 hover:bg-primary/10 border-primary/30 text-primary hover:text-primary hover:border-primary transition-colors"
              aria-label={`Edit ${category.name}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onDelete(category)}
              className="bg-background/80 hover:bg-destructive/10 border-destructive/30 text-destructive hover:text-destructive hover:border-destructive transition-colors"
              aria-label={`Delete ${category.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {category.showInNavigation !== false && (
          <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800 mt-2">
            Navigation
          </Badge>
        )}
        <CardDescription className="mt-2 line-clamp-2 text-muted-foreground">
          {category.description || 'No description'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        {category.imageUrl && (
          <div className="mb-4 rounded-md overflow-hidden h-36 flex items-center justify-center border border-border bg-muted/50">
            <ImageWithFallback 
              src={category.imageUrl} 
              alt={category.name}
              className="w-full h-full object-cover" 
              fallbackSrc="/placeholder.svg"
            />
          </div>
        )}
        
        <div className="space-y-3 mb-4">
          <div className="text-sm bg-muted/30 p-2 rounded-md flex items-center justify-between">
            <span className="font-medium text-foreground">Slug:</span> 
            <span className="text-muted-foreground font-mono text-xs bg-background/50 py-1 px-2 rounded border border-border">
              {category.slug}
            </span>
          </div>
          
          <div className="text-sm bg-muted/30 p-2 rounded-md flex items-center justify-between">
            <span className="font-medium text-foreground flex items-center">
              <Layers className="h-3.5 w-3.5 mr-1.5 text-primary" /> 
              Subcategories:
            </span> 
            <Badge variant="secondary" className="text-xs">
              {category.subcategories?.length || 0}
            </Badge>
          </div>
          
          {category.navigationOrder !== undefined && (
            <div className="text-sm bg-muted/30 p-2 rounded-md flex items-center justify-between">
              <span className="font-medium text-foreground">Nav Order:</span> 
              <Badge variant="outline" className="text-xs">
                {category.navigationOrder}
              </Badge>
            </div>
          )}
        </div>
        
        {category.subcategories && category.subcategories.length > 0 && (
          <SubcategoryList 
            subcategories={category.subcategories} 
            className="mt-4"
          />
        )}
      </CardContent>
      
      <CardFooter className="bg-muted/20 border-t border-border/50 pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-primary border-primary/30 hover:bg-primary/10 hover:text-primary bg-background/50"
          asChild
        >
          <a href={`/categories/${category.slug}`} target="_blank" rel="noopener noreferrer">
            View Category <ArrowUpRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
