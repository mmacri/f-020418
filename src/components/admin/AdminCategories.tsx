
import React, { useState, useEffect } from "react";
import { 
  getNavigationCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  CategoryInput
} from "@/services/categoryService";
import { getAllCategoryContent } from "@/services/categoryContentService";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  PlusCircle, 
  Trash2, 
  Save, 
  Edit, 
  AlertCircle, 
  ArrowUpDown 
} from "lucide-react";
import AdminCategoryContent from "./AdminCategoryContent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CategoryFormData {
  id?: number;
  name: string;
  slug: string;
  description: string;
  parentId?: number | null;
  // Add the missing subcategories field with a default empty array
  subcategories: any[];
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryContent, setCategoryContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    parentId: null,
    subcategories: [] // Initialize with empty array
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const categoriesData = await getNavigationCategories();
      setCategories(categoriesData);
      
      const contentData = await getAllCategoryContent();
      setCategoryContent(contentData);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditCategory = (category: any) => {
    setFormData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parentId: category.parentId,
      subcategories: category.subcategories || [] // Keep existing subcategories or use empty array
    });
    setEditingId(category.id);
    setShowDialog(true);
  };

  const handleAddNew = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      parentId: null,
      subcategories: [] // Initialize with empty array
    });
    setEditingId(null);
    setShowDialog(true);
  };

  const handleGenerateSlug = () => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId !== null) {
        // Update existing category
        await updateCategory(editingId, formData);
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        // Create new category
        await createCategory(formData);
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }
      
      await loadData();
      setShowDialog(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category? This will also delete all associated content and cannot be undone.")) {
      setIsLoading(true);
      try {
        await deleteCategory(id);
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
        await loadData();
      } catch (error) {
        console.error("Error deleting category:", error);
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Categories Management</CardTitle>
          <CardDescription>
            Manage product categories and their content for your site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="structure">
            <TabsList className="mb-6">
              <TabsTrigger value="structure">Category Structure</TabsTrigger>
              <TabsTrigger value="content">Category Content</TabsTrigger>
            </TabsList>
            
            <TabsContent value="structure" className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Create, edit, and organize your product categories. Categories are used to group products and organize your navigation.
                </p>
                <Button onClick={handleAddNew}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Category
                </Button>
              </div>
              
              {categories.length === 0 ? (
                <div className="text-center p-10 border rounded-md">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">No categories found. Create your first category to get started.</p>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-4 text-left font-medium text-gray-600">Name</th>
                        <th className="p-4 text-left font-medium text-gray-600">Slug</th>
                        <th className="p-4 text-left font-medium text-gray-600">Description</th>
                        <th className="p-4 text-left font-medium text-gray-600">Content Status</th>
                        <th className="p-4 text-right font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {categories.map((category) => {
                        const hasContent = categoryContent.some(c => c.slug === category.slug);
                        
                        return (
                          <tr key={category.id} className="hover:bg-gray-50">
                            <td className="p-4">{category.name}</td>
                            <td className="p-4 text-gray-600">{category.slug}</td>
                            <td className="p-4 text-gray-600">{category.description || "-"}</td>
                            <td className="p-4">
                              {hasContent ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Content Added
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  No Content
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditCategory(category)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700" 
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingId ? "Edit Category" : "Add New Category"}</DialogTitle>
                    <DialogDescription>
                      {editingId 
                        ? "Update the details for this category" 
                        : "Create a new category for your products"}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Category Name</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="e.g., Massage Guns"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="slug"
                          name="slug"
                          value={formData.slug}
                          onChange={handleFormChange}
                          placeholder="e.g., massage-guns"
                          required
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleGenerateSlug}
                        >
                          Generate
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Used in URLs: example.com/category/slug
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input 
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        placeholder="Brief category description"
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Category"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </TabsContent>
            
            <TabsContent value="content">
              <AdminCategoryContent />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategories;

