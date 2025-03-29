
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

interface CategoryCardProps {
  category: any;
  onEdit: (category: any) => void;
  onDelete: (category: any) => void;
}

const CategoryCard = ({ category, onEdit, onDelete }: CategoryCardProps) => {
  return (
    <Card key={category.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{category.name}</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete(category)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
        {category.showInNavigation !== false && (
          <Badge variant="outline" className="bg-green-50">Navigation</Badge>
        )}
        <CardDescription className="mt-2 line-clamp-2">
          {category.description || 'No description'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Slug:</span> {category.slug}
          </div>
          <div className="text-sm">
            <span className="font-medium">Subcategories:</span> {category.subcategories?.length || 0}
          </div>
          {category.navigationOrder !== undefined && (
            <div className="text-sm">
              <span className="font-medium">Nav Order:</span> {category.navigationOrder}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
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
