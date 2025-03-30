
import React, { useState, useEffect } from 'react';
import { Product } from '@/services/products/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  BasicInfoFields,
  PricingFields,
  CategoryFields,
  RatingImageFields,
  FeaturesSection,
  AffiliateStockFields,
  FormActions
} from './product-form';

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
        categoryId: editingProduct.categoryId ? Number(editingProduct.categoryId) : 0,
        subcategory: editingProduct.subcategory || '',
        rating: editingProduct.rating || 4.5,
        reviewCount: editingProduct.reviewCount || 0,
        imageUrl: editingProduct.imageUrl || '',
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
          <BasicInfoFields 
            name={formData.name}
            slug={formData.slug}
            shortDescription={formData.shortDescription}
            description={formData.description}
            handleInputChange={handleInputChange}
          />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pricing & Categorization</h3>
            
            <PricingFields 
              price={formData.price}
              comparePrice={formData.comparePrice}
              brand={formData.brand}
              handleInputChange={handleInputChange}
            />
            
            <CategoryFields 
              categoryId={formData.categoryId}
              subcategory={formData.subcategory}
              categories={categories}
              subcategories={subcategories}
              handleCategoryChange={handleCategoryChange}
              handleSubcategoryChange={handleSubcategoryChange}
            />
          </div>
          
          <RatingImageFields 
            rating={formData.rating}
            reviewCount={formData.reviewCount}
            imageUrl={formData.imageUrl}
            handleInputChange={handleInputChange}
          />
          
          <FeaturesSection 
            features={formData.features}
            handleFeatureChange={handleFeatureChange}
            handleAddFeature={handleAddFeature}
            handleRemoveFeature={handleRemoveFeature}
          />
          
          <AffiliateStockFields 
            affiliateLink={formData.affiliateLink}
            asin={formData.asin}
            inStock={formData.inStock}
            handleInputChange={handleInputChange}
            handleSwitchChange={handleSwitchChange}
          />
          
          <FormActions 
            isSubmitting={isSubmitting}
            isEditing={!!editingProduct}
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
