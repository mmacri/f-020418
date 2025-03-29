
  const handleSubmitSubcategory = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!selectedCategory) {
      toast({
        title: 'Error',
        description: 'No category selected.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Handle image upload if needed
      let finalImageUrl = subcategoryFormData.imageUrl;
      
      if (imageMethod === 'upload' && uploadedImage) {
        // In a real app, you would upload to a server here
        // For now, we'll use URL.createObjectURL for demo purposes
        finalImageUrl = URL.createObjectURL(uploadedImage);
      }
      
      const dataToSave = {
        ...subcategoryFormData,
        imageUrl: finalImageUrl,
      };
      
      if (editingSubcategory) {
        await updateSubcategory(selectedCategory.id, editingSubcategory.id, dataToSave);
        toast({
          title: 'Success',
          description: `Subcategory "${subcategoryFormData.name}" has been updated.`,
        });
      } else {
        await createSubcategory(selectedCategory.id, dataToSave);
        toast({
          title: 'Success',
          description: `Subcategory "${subcategoryFormData.name}" has been created.`,
        });
      }
      
      setIsSubcategoryModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving subcategory:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save subcategory. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
