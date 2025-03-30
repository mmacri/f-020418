
import React, { useState, useEffect } from 'react';
import { Product } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Trash2 } from 'lucide-react';

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  onSubmit: (product: any) => Promise<void>;
  categories: any[];
  subcategories: any[];
}

const ProductForm = ({ 
  open, 
  onOpenChange, 
  editingProduct, 
  onSubmit,
  categories,
  subcategories
}: ProductFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: 0,
    comparePrice: 0,
    category: '',
    categoryId: 0,
    subcategory: '',
    rating: 4.5,
    reviewCount: 0,
    imageUrl: '',
    features: ['', '', ''],
    inStock: true,
    affiliateLink: '',
    asin: '',
    brand: '',
  });

  useEffect(() => {
    if (editingProduct) {
      const features = Array.isArray(editingProduct.features) ? editingProduct.features : [];
      
      setFormData({
        name: editingProduct.name || '',
        slug: editingProduct.slug || '',
        description: editingProduct.description || '',
        shortDescription: editingProduct.shortDescription || '',
        price: editingProduct.price || 0,
        comparePrice: editingProduct.comparePrice || editingProduct.originalPrice || 0,
        category: editingProduct.category || '',
        categoryId: editingProduct.categoryId || 0,
        subcategory: editingProduct.subcategory || '',
        rating: editingProduct.rating || 4.5,
        reviewCount: editingProduct.reviewCount || 0,
        imageUrl: editingProduct.imageUrl || (editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images[0] : ''),
        features: features.length > 0 ? features : ['', '', ''],
        inStock: editingProduct.inStock !== false,
        affiliateLink: editingProduct.affiliateLink || editingProduct.affiliateUrl || '',
        asin: editingProduct.asin || '',
        brand: editingProduct.brand || '',
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        shortDescription: '',
        price: 0,
        comparePrice: 0,
        category: '',
        categoryId: 0,
        subcategory: '',
        rating: 4.5,
        reviewCount: 0,
        imageUrl: '',
        features: ['', '', ''],
        inStock: true,
        affiliateLink: '',
        asin: '',
        brand: '',
      });
    }
  }, [editingProduct]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCategoryChange = (value) => {
    const categoryId = parseInt(value, 10);
    const category = categories.find(cat => String(cat.id) === String(categoryId));
    
    setFormData(prev => ({
      ...prev,
      categoryId,
      category: category?.name || '',
      subcategory: '',
    }));
  };

  const handleSubcategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      subcategory: value
    }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  const handleAddFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let productSlug = formData.slug;
    if (!productSlug) {
      productSlug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    const filteredFeatures = formData.features.filter(f => f.trim() !== '');
    
    try {
      const productData = {
        ...formData,
        slug: productSlug,
        features: filteredFeatures,
        images: formData.imageUrl ? [formData.imageUrl] : []
      };
      
      await onSubmit(productData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
          <DialogDescription>
            {editingProduct 
              ? 'Update the product details below.' 
              : 'Add the details for your new product.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="auto-generated-if-left-empty"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="Brief description (shown in listings)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pricing & Categorization</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comparePrice">Compare Price ($)</Label>
                <Input
                  id="comparePrice"
                  name="comparePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.comparePrice}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Brand name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId.toString()}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={handleSubcategoryChange}
                  disabled={subcategories.length === 0}
                >
                  <SelectTrigger id="subcategory">
                    <SelectValue placeholder={subcategories.length === 0 ? "Select a category first" : "Select a subcategory"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.slug}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Ratings & Images</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (out of 5)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reviewCount">Number of Reviews</Label>
                <Input
                  id="reviewCount"
                  name="reviewCount"
                  type="number"
                  min="0"
                  value={formData.reviewCount}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Main Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/product-image.jpg"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Features</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAddFeature}
              >
                Add Feature
              </Button>
            </div>
            
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveFeature(index)}
                  disabled={formData.features.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Affiliate & Stock Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="affiliateLink">Affiliate Link</Label>
                <Input
                  id="affiliateLink"
                  name="affiliateLink"
                  value={formData.affiliateLink}
                  onChange={handleInputChange}
                  placeholder="https://www.amazon.com/dp/product-id?tag=yourtag-20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="asin">Amazon ASIN</Label>
                <Input
                  id="asin"
                  name="asin"
                  value={formData.asin}
                  onChange={handleInputChange}
                  placeholder="B00ABCDEFG"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked) => handleSwitchChange('inStock', checked)}
              />
              <Label htmlFor="inStock">Product is in stock</Label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingProduct ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
