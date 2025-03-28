// Import necessary dependencies
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getNavigationCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  deleteSubcategory,
  Category,
  Subcategory,
  CategoryInput,
  SubcategoryInput
} from "@/services/categoryService";

// Form handling imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Import necessary UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import icons
import { 
  FolderPlus, 
  FolderEdit, 
  FolderMinus,
  Plus, 
  Trash2, 
  AlertCircle, 
  Tag, 
  Image as ImageIcon, 
  Edit, 
  Folders, 
  Search
} from "lucide-react";

// Define schemas
const categoryFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  slug: z.string().min(2, { message: "Slug must be at least 2 characters" }),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }).optional(),
});

const subcategoryFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  slug: z.string().min(2, { message: "Slug must be at least 2 characters" }),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;
type SubcategoryFormValues = z.infer<typeof subcategoryFormSchema>;

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  const [isAddSubcategoryDialogOpen, setIsAddSubcategoryDialogOpen] = useState(false);
  const [isDeleteSubcategoryDialogOpen, setIsDeleteSubcategoryDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form instances
  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
    },
  });

  const subcategoryForm = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryList = await getNavigationCategories();
        setCategories(categoryList);
      } catch (error) {
        console.error("Error loading categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      }
    };

    loadCategories();
  }, [toast]);

  // Open add category dialog
  const openAddCategoryDialog = () => {
    categoryForm.reset();
    setIsAddCategoryDialogOpen(true);
  };

  // Open edit category dialog
  const openEditCategoryDialog = (category: Category) => {
    setCurrentCategory(category);
    categoryForm.reset({
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
    });
    setIsEditCategoryDialogOpen(true);
  };

  // Open delete category dialog
  const openDeleteCategoryDialog = (category: Category) => {
    setCurrentCategory(category);
    setIsDeleteCategoryDialogOpen(true);
  };

  // Open add subcategory dialog
  const openAddSubcategoryDialog = (category: Category) => {
    setCurrentCategory(category);
    subcategoryForm.reset();
    setIsAddSubcategoryDialogOpen(true);
  };

  // Open delete subcategory dialog
  const openDeleteSubcategoryDialog = (category: Category, subcategory: Subcategory) => {
    setCurrentCategory(category);
    setCurrentSubcategory(subcategory);
    setIsDeleteSubcategoryDialogOpen(true);
  };

  // Handle adding a new category
  const handleAddCategory = async (data: CategoryFormValues) => {
    setIsLoading(true);
    
    try {
      const newCategory = await createCategory({
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.imageUrl,
        subcategories: [] // Start with empty subcategories
      });
      
      setCategories([...categories, newCategory]);
      setIsAddCategoryDialogOpen(false);
      toast({
        title: "Success",
        description: `${data.name} category has been created.`,
      });
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating a category
  const handleUpdateCategory = async (data: CategoryFormValues) => {
    if (!currentCategory) return;
    
    setIsLoading(true);
    
    try {
      const updatedCategory = await updateCategory(currentCategory.id, {
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.imageUrl,
        subcategories: currentCategory.subcategories
      });
      
      setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
      setIsEditCategoryDialogOpen(false);
      toast({
        title: "Success",
        description: `${data.name} category has been updated.`,
      });
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async () => {
    if (!currentCategory) return;
    
    setIsLoading(true);
    
    try {
      await deleteCategory(currentCategory.id);
      setCategories(categories.filter(c => c.id !== currentCategory.id));
      setIsDeleteCategoryDialogOpen(false);
      toast({
        title: "Success",
        description: `${currentCategory.name} category has been deleted.`,
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a subcategory
  const handleAddSubcategory = async (data: SubcategoryFormValues) => {
    if (!currentCategory) return;
    
    setIsLoading(true);
    
    try {
      const newSubcategory = await createSubcategory(currentCategory.id, {
        name: data.name,
        slug: data.slug,
        description: data.description
      });
      
      // Update the category with the new subcategory
      const updatedCategory = { 
        ...currentCategory, 
        subcategories: [...currentCategory.subcategories, newSubcategory]
      };
      
      setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
      setIsAddSubcategoryDialogOpen(false);
      toast({
        title: "Success",
        description: `${data.name} subcategory has been added to ${currentCategory.name}.`,
      });
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add subcategory",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a subcategory
  const handleDeleteSubcategory = async () => {
    if (!currentCategory || !currentSubcategory) return;
    
    setIsLoading(true);
    
    try {
      await deleteSubcategory(currentCategory.id, currentSubcategory.id);
      
      // Update the category by filtering out the deleted subcategory
      const updatedCategory = {
        ...currentCategory,
        subcategories: currentCategory.subcategories.filter(
          (sub) => sub.id !== currentSubcategory.id
        ),
      };
      
      setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
      setIsDeleteSubcategoryDialogOpen(false);
      toast({
        title: "Success",
        description: `${currentSubcategory.name} subcategory has been deleted from ${currentCategory.name}.`,
      });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete subcategory",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Categories</h2>
        <Button onClick={openAddCategoryDialog}>
          <FolderPlus className="mr-2 h-4 w-4" /> Add New Category
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                You have {categories.length} categories in total.
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search categories..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="categories">
            <div className="flex justify-start mb-4">
              <TabsList>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="categories">
              <CategoriesTable
                categories={filteredCategories}
                onEdit={openEditCategoryDialog}
                onDelete={openDeleteCategoryDialog}
                onAddSubcategory={openAddSubcategoryDialog}
                onDeleteSubcategory={openDeleteSubcategoryDialog}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for your website.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(handleAddCategory)} className="space-y-6">
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Massage Guns" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="massage-guns" />
                    </FormControl>
                    <FormDescription>
                      Used in the category URL (e.g., /category/massage-guns)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Brief description of the category"
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          className="pl-10"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Category"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category: {currentCategory?.name}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(handleUpdateCategory)} className="space-y-6">
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Massage Guns" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="massage-guns" />
                    </FormControl>
                    <FormDescription>
                      Used in the category URL (e.g., /category/massage-guns)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Brief description of the category"
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          className="pl-10"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Category"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentCategory && (
            <div className="py-4">
              <div className="mb-4">
                <h3 className="font-medium">{currentCategory.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{currentCategory.description}</p>
              </div>
              
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  This will permanently delete the category and its subcategories.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isLoading} onClick={handleDeleteCategory}>
              {isLoading ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subcategory Dialog */}
      <Dialog open={isAddSubcategoryDialogOpen} onOpenChange={setIsAddSubcategoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Subcategory</DialogTitle>
            <DialogDescription>
              Create a new subcategory for {currentCategory?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...subcategoryForm}>
            <form onSubmit={subcategoryForm.handleSubmit(handleAddSubcategory)} className="space-y-6">
              <FormField
                control={subcategoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Percussion" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={subcategoryForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="percussion" />
                    </FormControl>
                    <FormDescription>
                      Used in the subcategory URL (e.g., /category/massage-guns/percussion)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={subcategoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Brief description of the subcategory"
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddSubcategoryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Subcategory"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Subcategory Dialog */}
      <Dialog open={isDeleteSubcategoryDialogOpen} onOpenChange={setIsDeleteSubcategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subcategory</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subcategory? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentCategory && currentSubcategory && (
            <div className="py-4">
              <div className="mb-4">
                <h3 className="font-medium">{currentSubcategory.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{currentSubcategory.description}</p>
              </div>
              
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  This will permanently delete the subcategory.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteSubcategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isLoading} onClick={handleDeleteSubcategory}>
              {isLoading ? "Deleting..." : "Delete Subcategory"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAddSubcategory: (category: Category) => void;
  onDeleteSubcategory: (category: Category, subcategory: Subcategory) => void;
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  onEdit,
  onDelete,
  onAddSubcategory,
  onDeleteSubcategory
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Subcategories</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded bg-gray-100 mr-3 overflow-hidden">
                      {category.imageUrl && (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {category.slug}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  {category.subcategories.length > 0 ? (
                    <div className="flex flex-col">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="flex items-center justify-between py-1">
                          <span className="text-sm">{subcategory.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteSubcategory(category, subcategory)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">No subcategories</span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => onAddSubcategory(category)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Subcategory
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminCategories;
