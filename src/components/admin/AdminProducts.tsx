
import { useState, useEffect } from "react";
import { 
  Package, 
  Pencil, 
  Plus, 
  Trash2, 
  Search, 
  X,
  AlertCircle,
  Star,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  Product
} from "@/services/productService";
import { getNavigationCategories } from "@/services/categoryService";
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const productFormSchema = z.object({
  title: z.string().min(3, { message: "Product title must be at least 3 characters" }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  originalPrice: z.coerce.number().positive({ message: "Original price must be a positive number" }).optional(),
  category: z.string().min(1, { message: "Category is required" }),
  subcategory: z.string().optional(),
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }),
  additionalImages: z.array(z.string().url({ message: "Please enter a valid image URL" })).optional(),
  asin: z.string().min(1, { message: "ASIN is required" }),
  rating: z.coerce.number().min(0).max(5, { message: "Rating must be between 0 and 5" }),
  reviewCount: z.coerce.number().min(0, { message: "Review count must be a positive number" }),
  affiliateUrl: z.string().url({ message: "Please enter a valid affiliate URL" }),
  bestSeller: z.boolean().default(false).optional(),
  inStock: z.boolean().default(true),
  features: z.array(z.string().min(3, { message: "Feature must be at least 3 characters" }))
    .min(1, { message: "At least one feature is required" }),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize the form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      shortDescription: "",
      price: 0,
      originalPrice: undefined,
      category: "",
      subcategory: "",
      imageUrl: "",
      additionalImages: [],
      asin: "",
      rating: 0,
      reviewCount: 0,
      affiliateUrl: "",
      bestSeller: false,
      inStock: true,
      features: [""],
    },
  });

  // Load products and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        const productData = await getProducts();
        setProducts(productData);

        const categoryData = await getNavigationCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load products or categories",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [toast]);

  // Update subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(c => c.slug === selectedCategory);
      if (category) {
        setSubcategories(category.subcategories || []);
      } else {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, categories]);

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    form.setValue("category", value);
    form.setValue("subcategory", "");
  };

  // Open add product dialog
  const openAddDialog = () => {
    form.reset();
    setIsAddDialogOpen(true);
  };

  // Open edit product dialog
  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setSelectedCategory(product.category);
    
    form.reset({
      title: product.title,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription || "",
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      subcategory: product.subcategory || "",
      imageUrl: product.imageUrl,
      additionalImages: product.additionalImages || [],
      asin: product.asin,
      rating: product.rating,
      reviewCount: product.reviewCount,
      affiliateUrl: product.affiliateUrl,
      bestSeller: product.bestSeller || false,
      inStock: product.inStock,
      features: product.features || [""],
    });
    
    setIsEditDialogOpen(true);
  };

  // Open delete product dialog
  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // Add feature field
  const addFeatureField = () => {
    const features = form.getValues("features");
    form.setValue("features", [...features, ""]);
  };

  // Remove feature field
  const removeFeatureField = (index: number) => {
    const features = form.getValues("features");
    if (features.length > 1) {
      form.setValue(
        "features",
        features.filter((_, i) => i !== index)
      );
    }
  };

  // Handle add product
  const handleAddProduct = async (data: ProductFormValues) => {
    setIsLoading(true);
    
    try {
      const newProduct = await createProduct({
        ...data,
        id: 0, // This will be assigned by the service
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      setProducts([...products, newProduct]);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: `${data.title} has been added successfully.`,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit product
  const handleEditProduct = async (data: ProductFormValues) => {
    if (!currentProduct) return;
    
    setIsLoading(true);
    
    try {
      const updatedProduct = await updateProduct(currentProduct.id, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: `${data.title} has been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!currentProduct) return;
    
    setIsLoading(true);
    
    try {
      await deleteProduct(currentProduct.id);
      
      setProducts(products.filter(p => p.id !== currentProduct.id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: `${currentProduct.title} has been deleted.`,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products by search query
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Products</h2>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                You have {products.length} products in total.
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded bg-gray-100 mr-3 overflow-hidden">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.title}</div>
                            <div className="text-xs text-gray-500">ID: {product.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{product.category.replace(/-/g, ' ')}</div>
                        {product.subcategory && (
                          <div className="text-xs text-gray-500">
                            {product.subcategory.replace(/-/g, ' ')}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${product.price.toFixed(2)}</div>
                        {product.originalPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{product.rating}</span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({product.reviewCount})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            product.inStock
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </div>
                        {product.bestSeller && (
                          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 ml-2">
                            Best Seller
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => openEditDialog(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(product)}
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
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new product to your catalog.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddProduct)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Theragun Pro" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="theragun-pro" />
                        </FormControl>
                        <FormDescription>
                          Used in the product URL (e.g., /products/theragun-pro)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Professional-grade massage device" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} type="number" step="0.01" className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Original Price ($)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input 
                                {...field} 
                                type="number" 
                                step="0.01" 
                                className="pl-10" 
                                placeholder="Optional"
                                onChange={(e) => {
                                  if (e.target.value === "") {
                                    field.onChange(undefined);
                                  } else {
                                    field.onChange(e.target.value);
                                  }
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={handleCategoryChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.slug} value={category.slug}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subcategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcategory</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={subcategories.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subcategory" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subcategories.map((subcategory) => (
                                <SelectItem key={subcategory.slug} value={subcategory.slug}>
                                  {subcategory.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating (0-5)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Star className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input 
                                {...field} 
                                type="number" 
                                min="0" 
                                max="5" 
                                step="0.1" 
                                className="pl-10" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="reviewCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Review Count</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="asin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amazon ASIN</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input {...field} className="pl-10" placeholder="B07TRSYXB9" />
                          </div>
                        </FormControl>
                        <FormDescription>
                          The Amazon Standard Identification Number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Detailed product description..." 
                            className="min-h-[150px] resize-y"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image URL</FormLabel>
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
                  
                  <FormField
                    control={form.control}
                    name="affiliateUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Affiliate URL</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              {...field} 
                              className="pl-10" 
                              placeholder="https://amazon.com/dp/B07TRSYXB9?tag=yourtag-20" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name="bestSeller"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                          </FormControl>
                          <FormLabel className="text-sm">Best Seller</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="inStock"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                          </FormControl>
                          <FormLabel className="text-sm">In Stock</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <FormLabel>Product Features</FormLabel>
                    <FormDescription className="mb-2">
                      Add key features and benefits of the product
                    </FormDescription>
                    
                    {form.watch("features").map((_, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <FormField
                          control={form.control}
                          name={`features.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1 mr-2">
                              <FormControl>
                                <div className="relative">
                                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input 
                                    {...field} 
                                    className="pl-10" 
                                    placeholder="Product feature" 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeFeatureField(index)}
                          disabled={form.watch("features").length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={addFeatureField}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Feature
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Product"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details for {currentProduct?.title}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditProduct)} className="space-y-6">
              {/* Same form fields as Add Product Dialog */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Theragun Pro" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="theragun-pro" />
                        </FormControl>
                        <FormDescription>
                          Used in the product URL (e.g., /products/theragun-pro)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Professional-grade massage device" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input {...field} type="number" step="0.01" className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Original Price ($)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input 
                                {...field} 
                                type="number" 
                                step="0.01" 
                                className="pl-10" 
                                placeholder="Optional"
                                onChange={(e) => {
                                  if (e.target.value === "") {
                                    field.onChange(undefined);
                                  } else {
                                    field.onChange(e.target.value);
                                  }
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={handleCategoryChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.slug} value={category.slug}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subcategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcategory</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={subcategories.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subcategory" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subcategories.map((subcategory) => (
                                <SelectItem key={subcategory.slug} value={subcategory.slug}>
                                  {subcategory.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating (0-5)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Star className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input 
                                {...field} 
                                type="number" 
                                min="0" 
                                max="5" 
                                step="0.1" 
                                className="pl-10" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="reviewCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Review Count</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="asin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amazon ASIN</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input {...field} className="pl-10" placeholder="B07TRSYXB9" />
                          </div>
                        </FormControl>
                        <FormDescription>
                          The Amazon Standard Identification Number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Detailed product description..." 
                            className="min-h-[150px] resize-y"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image URL</FormLabel>
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
                  
                  <FormField
                    control={form.control}
                    name="affiliateUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Affiliate URL</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              {...field} 
                              className="pl-10" 
                              placeholder="https://amazon.com/dp/B07TRSYXB9?tag=yourtag-20" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name="bestSeller"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                          </FormControl>
                          <FormLabel className="text-sm">Best Seller</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="inStock"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                          </FormControl>
                          <FormLabel className="text-sm">In Stock</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <FormLabel>Product Features</FormLabel>
                    <FormDescription className="mb-2">
                      Add key features and benefits of the product
                    </FormDescription>
                    
                    {form.watch("features").map((_, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <FormField
                          control={form.control}
                          name={`features.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1 mr-2">
                              <FormControl>
                                <div className="relative">
                                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input 
                                    {...field} 
                                    className="pl-10" 
                                    placeholder="Product feature" 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeFeatureField(index)}
                          disabled={form.watch("features").length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={addFeatureField}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Feature
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Product"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentProduct && (
            <div className="py-4">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded bg-gray-100 mr-3 overflow-hidden">
                  {currentProduct.imageUrl && (
                    <img
                      src={currentProduct.imageUrl}
                      alt={currentProduct.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <div className="font-medium">{currentProduct.title}</div>
                  <div className="text-sm text-gray-500">${currentProduct.price.toFixed(2)}</div>
                </div>
              </div>
              
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  This will permanently delete the product and all its data.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isLoading} onClick={handleDeleteProduct}>
              {isLoading ? "Deleting..." : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
