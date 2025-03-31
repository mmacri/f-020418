
import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getNavigationCategories } from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';
import SubcategoryForm from './SubcategoryForm';
import { Link } from 'react-router-dom';

const SubcategoryManager = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    showInNavigation: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageMethod, setImageMethod] = useState<'url' | 'upload'>('url');
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const category = categories.find(cat => cat.id === selectedCategory);
      setSubcategories(category?.subcategories || []);
    } else {
      // If no category is selected, collect all subcategories from all categories
      const allSubcategories = categories.flatMap(cat => 
        cat.subcategories?.map(sub => ({
          ...sub,
          categoryName: cat.name,
          categoryId: cat.id,
          categorySlug: cat.slug
        })) || []
      );
      setSubcategories(allSubcategories);
    }
  }, [selectedCategory, categories]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getNavigationCategories();
      setCategories(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories. Please try again.',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  const handleCreateSubcategory = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      showInNavigation: true
    });
    setIsEditing(false);
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleEditSubcategory = (subcategory) => {
    setFormData({
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description || '',
      imageUrl: subcategory.imageUrl || '',
      showInNavigation: subcategory.showInNavigation !== false
    });
    setIsEditing(true);
    setEditingId(subcategory.id);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    });
  };

  const handleImageMethodChange = (value: 'url' | 'upload') => {
    setImageMethod(value);
  };

  const handleImageChange = (url: string) => {
    setFormData({
      ...formData,
      imageUrl: url
    });
  };

  const handleSubmitSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would typically save to the database
    toast({
      title: isEditing ? 'Subcategory Updated' : 'Subcategory Created',
      description: `Successfully ${isEditing ? 'updated' : 'created'} subcategory "${formData.name}"`,
    });
    
    setIsDialogOpen(false);
    // In a real implementation, this would refresh the data
  };

  const handleDeleteSubcategory = (subcategory) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${subcategory.name}"? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      // This would typically delete from the database
      toast({
        title: 'Subcategory Deleted',
        description: `Successfully deleted subcategory "${subcategory.name}"`,
      });
      
      // In a real implementation, this would refresh the data
    }
  };

  const filteredSubcategories = subcategories.filter(subcategory =>
    subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subcategory.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewSubcategoryPage = (subcategory, categorySlug) => {
    window.open(`/categories/${categorySlug}/${subcategory.slug}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Subcategory Management</h2>
          <p className="text-muted-foreground">Manage your subcategories</p>
        </div>
        <Button onClick={handleCreateSubcategory} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Subcategory
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-2/3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subcategories..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[200px]">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="pt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="h-64 animate-pulse">
                  <div className="bg-muted h-full"></div>
                </Card>
              ))}
            </div>
          ) : filteredSubcategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium mb-4">No subcategories found</p>
              <p className="text-muted-foreground mb-8">
                {searchTerm ? "Try a different search term or" : "Get started by"} creating a new subcategory
              </p>
              <Button onClick={handleCreateSubcategory}>
                <Plus className="h-4 w-4 mr-2" />
                Create Subcategory
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubcategories.map(subcategory => (
                <Card key={subcategory.id} className="overflow-hidden flex flex-col">
                  <div 
                    className="h-32 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${subcategory.imageUrl || '/placeholder.svg'})`,
                      backgroundSize: 'cover'
                    }}
                  />
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <span className="truncate">{subcategory.name}</span>
                      {subcategory.showInNavigation !== false && (
                        <Badge variant="secondary" className="ml-2">In Nav</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 h-10">
                      {subcategory.description || `Subcategory of ${subcategory.categoryName || "Unknown"}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-primary/10">
                        {subcategory.categoryName || "Unknown"}
                      </Badge>
                      <Badge variant="outline" className="bg-muted">
                        /{subcategory.slug}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEditSubcategory(subcategory)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDeleteSubcategory(subcategory)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => viewSubcategoryPage(subcategory, subcategory.categorySlug)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list" className="pt-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : filteredSubcategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium mb-4">No subcategories found</p>
              <p className="text-muted-foreground mb-8">
                {searchTerm ? "Try a different search term or" : "Get started by"} creating a new subcategory
              </p>
              <Button onClick={handleCreateSubcategory}>
                <Plus className="h-4 w-4 mr-2" />
                Create Subcategory
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSubcategories.map(subcategory => (
                <div 
                  key={subcategory.id} 
                  className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="h-10 w-10 rounded bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url(${subcategory.imageUrl || '/placeholder.svg'})` 
                      }}
                    />
                    <div>
                      <div className="font-medium">{subcategory.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {subcategory.categoryName || "Unknown"} / {subcategory.slug}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {subcategory.showInNavigation !== false && (
                      <Badge variant="secondary">In Nav</Badge>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEditSubcategory(subcategory)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteSubcategory(subcategory)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => viewSubcategoryPage(subcategory, subcategory.categorySlug)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit' : 'Create'} Subcategory</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update the subcategory details below." 
                : "Add a new subcategory to your catalog."}
            </DialogDescription>
          </DialogHeader>
          
          <SubcategoryForm
            formData={formData}
            isEditing={isEditing}
            onInputChange={handleInputChange}
            onNameChange={handleNameChange}
            onSubmit={handleSubmitSubcategory}
            onCancel={() => setIsDialogOpen(false)}
            isLoading={false}
            imageMethod={imageMethod}
            onImageMethodChange={handleImageMethodChange}
            onImageChange={handleImageChange}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubcategoryManager;
