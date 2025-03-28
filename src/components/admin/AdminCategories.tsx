
import React, { useState, useEffect } from "react";
import { 
  getNavigationCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  CategoryInput
} from "@/services/categoryService";
import { getAllCategoryContent } from "@/services/categoryContentService";
import { getProducts, updateProduct } from "@/services/productService";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  PlusCircle, 
  Trash2, 
  Save, 
  Edit, 
  AlertCircle, 
  ArrowUpDown,
  Link,
  Eye
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface CategoryFormData {
  id?: number;
  name: string;
  slug: string;
  description: string;
  parentId?: number | null;
  subcategories: any[];
  showInNavigation?: boolean;
  navigationOrder?: number;
}

interface NavigationItem {
  id: number;
  title: string;
  type: string;
  url?: string;
  showInHeader?: boolean;
  items?: NavigationItem[];
}

interface ProductAssignmentData {
  productId: number;
  productName: string;
  currentCategory: number | null;
  selected: boolean;
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
    subcategories: [],
    showInNavigation: true,
    navigationOrder: 0
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showProductsDialog, setShowProductsDialog] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [productAssignments, setProductAssignments] = useState<ProductAssignmentData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductAssignmentData[]>([]);
  const [productFilter, setProductFilter] = useState("");
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

      const productsData = await getProducts();
      setProducts(productsData);
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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleEditCategory = (category: any) => {
    setFormData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parentId: category.parentId,
      subcategories: category.subcategories || [],
      showInNavigation: category.showInNavigation !== false, // Default to true if not set
      navigationOrder: category.navigationOrder || 0
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
      subcategories: [],
      showInNavigation: true,
      navigationOrder: categories.length
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

  const handlePreviewCategory = (slug: string) => {
    window.open(`/categories/${slug}`, '_blank');
  };

  const openProductsAssignment = (categoryId: number) => {
    setCurrentCategoryId(categoryId);
    
    // Prepare product assignments
    const assignmentsData = products.map(product => ({
      productId: product.id,
      productName: product.name,
      currentCategory: product.categoryId,
      selected: product.categoryId === categoryId
    }));
    
    setProductAssignments(assignmentsData);
    setFilteredProducts(assignmentsData);
    setShowProductsDialog(true);
  };

  const handleProductFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filterText = e.target.value.toLowerCase();
    setProductFilter(e.target.value);
    
    const filtered = productAssignments.filter(product => 
      product.productName.toLowerCase().includes(filterText)
    );
    
    setFilteredProducts(filtered);
  };

  const toggleProductSelection = (productId: number) => {
    setProductAssignments(prev => 
      prev.map(item => 
        item.productId === productId 
          ? { ...item, selected: !item.selected }
          : item
      )
    );
    
    setFilteredProducts(prev => 
      prev.map(item => 
        item.productId === productId 
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const saveProductAssignments = async () => {
    setIsLoading(true);
    
    try {
      // Get selected products
      const selectedProducts = productAssignments.filter(p => p.selected);
      const unselectedProducts = productAssignments.filter(p => !p.selected && p.currentCategory === currentCategoryId);
      
      // Update each product
      const updatePromises = [
        ...selectedProducts.map(p => 
          updateProduct(p.productId, { categoryId: currentCategoryId })
        ),
        ...unselectedProducts.map(p => 
          updateProduct(p.productId, { categoryId: null })
        )
      ];
      
      await Promise.all(updatePromises);
      
      toast({
        title: "Success",
        description: `Updated ${selectedProducts.length} products in this category`,
      });
      
      setShowProductsDialog(false);
      await loadData();
    } catch (error) {
      console.error("Error assigning products:", error);
      toast({
        title: "Error",
        description: "Failed to update product assignments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Categories Management</CardTitle>
          <CardDescription>
            Manage product categories, their content, and navigation structure for your site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="structure">
            <TabsList className="mb-6">
              <TabsTrigger value="structure">Category Structure</TabsTrigger>
              <TabsTrigger value="content">Category Content</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
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
                        <th className="p-4 text-left font-medium text-gray-600">In Nav</th>
                        <th className="p-4 text-left font-medium text-gray-600">Products</th>
                        <th className="p-4 text-right font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {categories.map((category) => {
                        const hasContent = categoryContent.some(c => c.slug === category.slug);
                        const productCount = products.filter(p => p.categoryId === category.id).length;
                        
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
                            <td className="p-4">
                              {category.showInNavigation !== false ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Visible
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Hidden
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openProductsAssignment(category.id)}
                              >
                                {productCount} Products
                              </Button>
                            </td>
                            <td className="p-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handlePreviewCategory(category.slug)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Preview
                              </Button>
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

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="showInNavigation" 
                        checked={formData.showInNavigation} 
                        onCheckedChange={(checked) => handleCheckboxChange('showInNavigation', checked as boolean)}
                      />
                      <Label htmlFor="showInNavigation">Show in navigation menu</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="navigationOrder">Navigation Order</Label>
                      <Input 
                        id="navigationOrder"
                        name="navigationOrder"
                        type="number"
                        value={formData.navigationOrder?.toString()}
                        onChange={handleFormChange}
                        placeholder="Display order in navigation (0 = first)"
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

              <Dialog open={showProductsDialog} onOpenChange={setShowProductsDialog}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Assign Products to Category</DialogTitle>
                    <DialogDescription>
                      Select which products should be assigned to this category.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="productFilter">Filter Products</Label>
                      <Input
                        id="productFilter"
                        value={productFilter}
                        onChange={handleProductFilterChange}
                        placeholder="Type to filter products..."
                      />
                    </div>

                    <div className="border rounded-md overflow-hidden max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Select</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Current Category</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProducts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-4">
                                No products found matching your filter.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredProducts.map((product) => {
                              const category = categories.find(c => c.id === product.currentCategory);
                              return (
                                <TableRow key={product.productId} className="hover:bg-gray-50">
                                  <TableCell>
                                    <Checkbox 
                                      checked={product.selected}
                                      onCheckedChange={() => toggleProductSelection(product.productId)}
                                    />
                                  </TableCell>
                                  <TableCell>{product.productName}</TableCell>
                                  <TableCell>{category ? category.name : 'None'}</TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowProductsDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={saveProductAssignments} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Assignments"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
            
            <TabsContent value="content">
              <AdminCategoryContent />
            </TabsContent>

            <TabsContent value="navigation">
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                  <h3 className="font-medium text-amber-800 mb-2">Navigation Settings</h3>
                  <p className="text-amber-700 text-sm">
                    Navigation is automatically generated based on your categories. Use the options in the Category Structure 
                    tab to control which categories appear in the navigation menu and their order.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Main Navigation Preview</h3>
                    <div className="border rounded-md p-4 bg-gray-50">
                      <ul className="flex space-x-6">
                        {categories
                          .filter(cat => cat.showInNavigation !== false)
                          .sort((a, b) => (a.navigationOrder || 0) - (b.navigationOrder || 0))
                          .map(cat => (
                            <li key={cat.id} className="relative">
                              <div className="font-medium py-2 inline-flex items-center">
                                {cat.name}
                                {cat.subcategories?.length > 0 && (
                                  <ArrowUpDown className="ml-1 h-4 w-4" />
                                )}
                              </div>
                            </li>
                          ))
                        }
                        <li>
                          <div className="font-medium py-2 inline-block">
                            Blog
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Tips for Navigation</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Categories marked as "Show in navigation menu" will appear in the main navigation.</li>
                      <li>The "Navigation Order" determines the sequence (lower numbers appear first).</li>
                      <li>Categories with subcategories will display dropdown menus.</li>
                      <li>Blog and other static pages are automatically included in navigation.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategories;
