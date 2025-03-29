
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
import { Edit, Trash2, ArrowUpRight } from 'lucide-react';
import { ImageWithFallback } from '@/lib/image-utils';

interface CategoryCardProps {
  category: any;
  onEdit: (category: any) => void;
  onDelete: (category: any) => void;
}

const CategoryCard = ({ category, onEdit, onDelete }: CategoryCardProps) => {
  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow bg-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-foreground">{category.name}</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(category)}
              className="hover:bg-secondary/20"
            >
              <Edit className="h-4 w-4 text-primary" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete(category)}
              className="hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        {category.showInNavigation !== false && (
          <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
            Navigation
          </Badge>
        )}
        <CardDescription className="mt-2 line-clamp-2 text-muted-foreground">
          {category.description || 'No description'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-2">
        {category.imageUrl && (
          <div className="mb-4 bg-muted rounded-md overflow-hidden h-32 flex items-center justify-center">
            <ImageWithFallback 
              src={category.imageUrl} 
              alt={category.name}
              className="w-full h-full object-cover" 
              fallbackSrc="/placeholder.svg"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <div className="text-sm text-foreground">
            <span className="font-medium">Slug:</span> <span className="text-muted-foreground">{category.slug}</span>
          </div>
          <div className="text-sm text-foreground">
            <span className="font-medium">Subcategories:</span> <span className="text-muted-foreground">{category.subcategories?.length || 0}</span>
          </div>
          {category.navigationOrder !== undefined && (
            <div className="text-sm text-foreground">
              <span className="font-medium">Nav Order:</span> <span className="text-muted-foreground">{category.navigationOrder}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-primary border-primary/30 hover:bg-primary/10 hover:text-primary"
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
