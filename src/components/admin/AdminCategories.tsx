
import { useState, useEffect } from "react";
import { 
  Folder, 
  FolderPlus, 
  Pencil, 
  Plus, 
  Trash2, 
  ChevronRight, 
  X, 
  AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { 
  getNavigationCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  createSubcategory, 
  updateSubcategory, 
  deleteSubcategory,
  Category,
  Subcategory
} from "@/services/categoryService";
import { useToast } from "@/hooks/use-toast";

// Form schemas
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
  const [isEditSubcategoryDialogOpen, setIsEditSubcategoryDialogOpen] = useState(false);
  const [isDeleteSubcategoryDialogOpen, setIsDeleteSubcategoryDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const { toast } = useToast();

  // Initialize the category form
  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
    },
  });

  // Initialize the subcategory form
  const subcategoryForm = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await getNavigationCategories();
        setCategories(categoryData);
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

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: number) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

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
      description: category.description || "",
      imageUrl: category.imageUrl || "",
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

  // Open edit subcategory dialog
  const openEditSubcategoryDialog = (category: Category, subcategory: Subcategory) => {
    setCurrentCategory(category);
    setCurrentSubcategory(subcategory);
    
    subcategoryForm.reset({
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description || "",
    });
    
    setIsEditSubcategoryDialogOpen(true);
  };

  // Open delete subcategory dialog
  const openDeleteSubcategoryDialog = (category: Category, subcategory: Subcategory) => {
    setCurrentCategory(category);
    setCurrentSubcategory(subcategory);
    setIsDeleteSubcategoryDialogOpen(true);
  };

  // Handle add category
  const handleAddCategory = async (data: CategoryFormValues) => {
    setIsLoading(true);
    
    try {
      const newCategory = await createCategory({
        ...data,
        id: 0, // This will be assigned by the service
        subcategories: [],
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
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit category
  const handleEditCategory = async (data: CategoryFormValues) => {
    if (!currentCategory) return;
    
    setIsLoading(true);
    
    try {
      const updatedCategory = await updateCategory(currentCategory.id, {
        ...data,
        subcategories: currentCategory.subcategories,
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
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete category
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
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add subcategory
  const handleAddSubcategory = async (data: SubcategoryFormValues) => {
    if (!currentCategory) return;
    
    setIsLoading(true);
    
    try {
      const newSubcategory = await createSubcategory(currentCategory.id, {
        ...data,
        id: 0, // This will be assigned by the service
      });
      
      const updatedCategories = categories.map(category => {
        if (category.id === currentCategory.id) {
          return {
            ...category,
            subcategories: [...category.subcategories, newSubcategory],
          };
        }
        return category;
      });
      
      setCategories(updatedCategories);
      setIsAddSubcategoryDialogOpen(false);
      
      // Ensure the parent category is expanded
      if (!expandedCategories.includes(currentCategory.id)) {
        setExpandedCategories([...expandedCategories, currentCategory.id]);
      }
      
      toast({
        title: "Success",
        description: `${data.name} subcategory has been created.`,
      });
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast({
        title: "Error",
        description: "Failed to create subcategory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit subcategory
  const handleEditSubcategory = async (data: SubcategoryFormValues) => {
    if (!currentCategory || !currentSubcategory) return;
    
    setIsLoading(true);
    
    try {
      const updatedSubcategory = await updateSubcategory(
        currentCategory.id,
        currentSubcategory.id,
        data
      );
      
      const updatedCategories = categories.map(category => {
        if (category.id === currentCategory.id) {
          return {
            ...category,
            subcategories: category.subcategories.map(subcat => 
              subcat.id === updatedSubcategory.id ? updatedSubcategory : subcat
            ),
          };
        }
        return category;
      });
      
      setCategories(updatedCategories);
      setIsEditSubcategoryDialogOpen(false);
      toast({
        title: "Success",
        description: `${data.name} subcategory has been updated.`,
      });
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast({
        title: "Error",
        description: "Failed to update subcategory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete subcategory
  const handleDeleteSubcategory = async () => {
    if (!currentCategory || !currentSubcategory) return;
    
    setIsLoading(true);
    
    try {
      await deleteSubcategory(currentCategory.id, currentSubcategory.id);
      
      const updatedCategories = categories.map(category => {
        if (category.id === currentCategory.id) {
          return {
            ...category,
            subcategories: category.subcategories.filter(
              subcat => subcat.id !== currentSubcategory.id
            ),
          };
        }
        return category;
      });
      
      setCategories(updatedCategories);
      setIsDeleteSubcategoryDialogOpen(false);
      toast({
        title: "Success",
        description: `${currentSubcategory.name} subcategory has been deleted.`,
      });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast({
        title: "Error",
        description: "Failed to delete subcategory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Categories</h2>
        <Button onClick={openAddCategoryDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add New Category
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Navigation Categories</CardTitle>
          <CardDescription>
            Manage your site's navigation structure and product categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No categories found. Click "Add New Category" to create one.
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="border rounded-lg overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                    onClick={() => toggleCategoryExpansion(category.id)}
                  >
                    <div className="flex items-center">
                      <Folder className="h-5 w-5 text-indigo-600 mr-3" />
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-xs text-gray-500">
                          {category.subcategories.length} subcategories
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          openAddSubcategoryDialog(category);
                        }}
                      >
                        <FolderPlus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditCategoryDialog(category);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteCategoryDialog(category);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <ChevronRight 
                        className={`ml-3 h-5 w-5 text-gray-400 transition-transform ${
                          expandedCategories.includes(category.id) ? "rotate-90" : ""
                        }`} 
                      />
                    </div>
                  </div>
                  
                  {expandedCategories.includes(category.id) && (
                    <div className="p-4 pl-8 border-t">
                      {category.subcategories.length === 0 ? (
                        <div className="text-center py-2 text-gray-500 text-sm">
                          No subcategories. Click the "+" button to add one.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {category.subcategories.map((subcategory) => (
                            <div key={subcategory.id} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></div>
                                  <div>
                                    <p className="font-medium">{subcategory.name}</p>
                                    <p className="text-xs text-gray-500">
                                      slug: {subcategory.slug}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mr-2"
                                    onClick={() => openEditSubcategoryDialog(category, subcategory)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openDeleteSubcategoryDialog(category, subcategory)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new top-level navigation category
            </DialogDescription>
          </DialogHeader>
          
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(handleAddCategory)} className="space-y-4">
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
                      Used in the category URL (e.g., /categories/massage-guns)
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
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Category description..." 
                        className="resize-y"
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
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/image.jpg" />
                    </FormControl>
                    <FormDescription>
                      Image to display on category pages
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Category"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the {currentCategory?.name} category
            </DialogDescription>
          </DialogHeader>
          
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(handleEditCategory)} className="space-y-4">
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
                      Used in the category URL (e.g., /categories/massage-guns)
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
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Category description..." 
                        className="resize-y"
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
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/image.jpg" />
                    </FormControl>
                    <FormDescription>
                      Image to display on category pages
                    </FormDescription>
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
              Are you sure you want to delete this category? This will also delete all of its subcategories.
            </DialogDescription>
          </DialogHeader>
          
          {currentCategory && (
            <div className="py-4">
              <div className="mb-4">
                <h3 className="font-medium">{currentCategory.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {currentCategory.subcategories.length} subcategories will also be deleted
                </p>
              </div>
              
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  This action cannot be undone. Products in this category may be affected.
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subcategory</DialogTitle>
            <DialogDescription>
              Create a new subcategory under {currentCategory?.name}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...subcategoryForm}>
            <form onSubmit={subcategoryForm.handleSubmit(handleAddSubcategory)} className="space-y-4">
              <FormField
                control={subcategoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Premium Massage Guns" />
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
                      <Input {...field} placeholder="premium" />
                    </FormControl>
                    <FormDescription>
                      Used in the URL (e.g., /categories/massage-guns/premium)
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
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Subcategory description..." 
                        className="resize-y"
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
                  {isLoading ? "Creating..." : "Create Subcategory"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog open={isEditSubcategoryDialogOpen} onOpenChange={setIsEditSubcategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
            <DialogDescription>
              Update the {currentSubcategory?.name} subcategory
            </DialogDescription>
          </DialogHeader>
          
          <Form {...subcategoryForm}>
            <form onSubmit={subcategoryForm.handleSubmit(handleEditSubcategory)} className="space-y-4">
              <FormField
                control={subcategoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Premium Massage Guns" />
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
                      <Input {...field} placeholder="premium" />
                    </FormControl>
                    <FormDescription>
                      Used in the URL (e.g., /categories/massage-guns/premium)
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
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Subcategory description..." 
                        className="resize-y"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditSubcategoryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Subcategory"}
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
              Are you sure you want to delete this subcategory?
            </DialogDescription>
          </DialogHeader>
          
          {currentSubcategory && (
            <div className="py-4">
              <div className="mb-4">
                <h3 className="font-medium">{currentSubcategory.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  From the {currentCategory?.name} category
                </p>
              </div>
              
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  This action cannot be undone. Products in this subcategory may be affected.
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

export default AdminCategories;
