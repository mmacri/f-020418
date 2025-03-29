
import React, { useState, useEffect } from 'react';
import { 
  getCategoryContent, 
  getCategoryContentBySlug, 
  saveCategoryContent,
  CategoryContent, 
  CategoryContentFAQ as CategoryFAQ 
} from '@/services/categoryContentService';
import { getNavigationCategories } from '@/services/categoryService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  PenSquare,
  Save,
  Trash2,
  PlusCircle,
  AlertCircle,
  Video,
  HelpCircle,
  Link,
  RefreshCw
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

const AdminCategoryContent = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryContent, setCategoryContent] = useState<CategoryContent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentContent, setCurrentContent] = useState<Partial<CategoryContent>>({});
  const [faqs, setFaqs] = useState<CategoryFAQ[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesList = await getNavigationCategories();
        setCategories(categoriesList);
        
        const contentList = await getCategoryContent();
        setCategoryContent(contentList);
        
        if (categoriesList.length > 0 && !selectedCategory) {
          handleCategorySelect(categoriesList[0].slug);
        }
      } catch (error) {
        console.error('Error loading category data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories and content',
          variant: 'destructive',
        });
      }
    };
    
    loadData();
  }, []);

  const handleCategorySelect = async (slug: string) => {
    setSelectedCategory(slug);
    setIsLoading(true);
    
    try {
      const content = await getCategoryContentBySlug(slug);
      
      if (content) {
        setCurrentContent(content);
        setFaqs(content.faqs || []);
        // Initialize benefits array from sections or as empty array
        const sectionContent = content.sections?.[0]?.content || '';
        const extractedBenefits = sectionContent
          .split('\n')
          .filter(line => line.trim().startsWith('•'))
          .map(line => line.trim().substring(1).trim());
        setBenefits(extractedBenefits.length > 0 ? extractedBenefits : []);
      } else {
        setCurrentContent({
          slug,
          headline: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          introduction: '',
          meta: {
            title: '',
            description: ''
          },
          sections: [],
          recommendations: [],
          faqs: []
        });
        setFaqs([]);
        setBenefits([]);
      }
    } catch (error) {
      console.error('Error loading category content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load category content',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentContent(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, '']);
  };

  const handleUpdateBenefit = (index: number, value: string) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index] = value;
    setBenefits(updatedBenefits);
  };

  const handleRemoveBenefit = (index: number) => {
    const updatedBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(updatedBenefits);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { id: `faq-${Date.now()}`, question: '', answer: '' }]);
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setFaqs(updatedFaqs);
  };

  const handleRemoveFaq = (index: number) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs);
  };

  // Since we don't have importContentFromUrl, let's implement a basic version
  const importContentFromUrl = async (categorySlug: string, url: string) => {
    // This would normally call an API, but we'll simulate it
    toast({
      title: 'Import Simulation',
      description: 'This would import content from ' + url,
    });
    
    // Return the current content for now
    return getCategoryContentBySlug(categorySlug);
  };

  const handleImportFromUrl = async () => {
    if (!selectedCategory || !importUrl) return;
    
    setIsImporting(true);
    
    try {
      const importedContent = await importContentFromUrl(selectedCategory, importUrl);
      
      if (importedContent) {
        setCurrentContent(importedContent);
        setFaqs(importedContent.faqs || []);
        // Extract benefits from sections content if available
        const sectionContent = importedContent.sections?.[0]?.content || '';
        const extractedBenefits = sectionContent
          .split('\n')
          .filter(line => line.trim().startsWith('•'))
          .map(line => line.trim().substring(1).trim());
        setBenefits(extractedBenefits);
        
        setCategoryContent(prev => 
          prev.map(c => c.slug === selectedCategory ? importedContent : c)
        );
        
        toast({
          title: 'Success',
          description: 'Content imported successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to import content from URL',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error importing content:', error);
      toast({
        title: 'Error',
        description: 'Failed to import content from URL',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
      setImportUrl('');
    }
  };

  const handleSaveContent = async () => {
    if (!selectedCategory) return;
    
    setIsLoading(true);
    
    try {
      // Create a proper section from benefits if any
      const sections = [...(currentContent.sections || [])];
      
      // Update first section with benefits or create one if none exists
      if (benefits.length > 0) {
        const benefitsContent = `
          ${benefits.map(benefit => `• ${benefit}`).join('\n')}
        `;
        
        if (sections.length > 0) {
          sections[0] = {
            ...sections[0],
            content: benefitsContent
          };
        } else {
          sections.push({
            id: `section-${Date.now()}`,
            title: 'Benefits',
            content: benefitsContent
          });
        }
      }
      
      const dataToSave: CategoryContent = {
        ...currentContent as CategoryContent,
        sections,
        faqs,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      const savedContent = await saveCategoryContent(dataToSave);
      
      if (savedContent) {
        setCategoryContent(prev => 
          prev.map(c => c.slug === selectedCategory ? savedContent : c)
        );
        
        toast({
          title: 'Success',
          description: 'Category content has been saved successfully',
        });
      }
    } catch (error) {
      console.error('Error saving category content:', error);
      toast({
        title: 'Error',
        description: 'Failed to save category content',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Category Content Management</h2>
        <Button 
          onClick={handleSaveContent} 
          disabled={isLoading || !selectedCategory}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
      
      <div className="flex gap-4">
        <div className="w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Select a category to edit its content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map(category => (
                  <Button
                    key={category.slug}
                    variant={selectedCategory === category.slug ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleCategorySelect(category.slug)}
                  >
                    <PenSquare className="mr-2 h-4 w-4" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {selectedCategory && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Import Content</CardTitle>
                <CardDescription>Import content from external sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="importUrl">Affiliate URL</Label>
                  <div className="flex mt-1 gap-2">
                    <Input
                      id="importUrl"
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                      placeholder="https://example.com/product"
                      className="flex-grow"
                    />
                    <Button 
                      variant="outline"
                      onClick={handleImportFromUrl}
                      disabled={isImporting || !importUrl}
                    >
                      <Link className="h-4 w-4 mr-1" />
                      Import
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Import content from affiliate product pages
                  </p>
                </div>
                
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleCategorySelect(selectedCategory)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="w-3/4">
          {selectedCategory ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit {currentContent.headline || selectedCategory}</CardTitle>
                <CardDescription>
                  Update the content that appears on the category page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic">
                  <TabsList className="mb-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="benefits">Benefits</TabsTrigger>
                    <TabsTrigger value="sections">Sections</TabsTrigger>
                    <TabsTrigger value="guide">Buying Guide</TabsTrigger>
                    <TabsTrigger value="faqs">FAQs</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div>
                      <Label htmlFor="headline">Title</Label>
                      <Input 
                        id="headline" 
                        name="headline" 
                        value={currentContent.headline || ''} 
                        onChange={handleInputChange} 
                        placeholder="Category Title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="meta.description">Meta Description</Label>
                      <Input 
                        id="meta.description" 
                        name="meta.description" 
                        value={currentContent.meta?.description || ''} 
                        onChange={(e) => {
                          setCurrentContent(prev => ({
                            ...prev,
                            meta: {
                              ...(prev.meta || {}),
                              description: e.target.value
                            }
                          }));
                        }} 
                        placeholder="Brief category description (for SEO)"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="introduction">Introduction</Label>
                      <Textarea 
                        id="introduction" 
                        name="introduction" 
                        value={currentContent.introduction || ''} 
                        onChange={handleInputChange} 
                        placeholder="Full introduction paragraph"
                        rows={5}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="benefits" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Product Benefits</h3>
                      <Button type="button" variant="outline" onClick={handleAddBenefit}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Benefit
                      </Button>
                    </div>
                    
                    {benefits.length === 0 ? (
                      <div className="text-center p-6 bg-gray-50 rounded-lg">
                        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-gray-500">No benefits added yet. Add some benefits to highlight product advantages.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="flex-grow">
                              <Textarea 
                                value={benefit} 
                                onChange={(e) => handleUpdateBenefit(index, e.target.value)}
                                placeholder="E.g., Accelerated Recovery: Reduces post-workout soreness and recovery time"
                                rows={2}
                              />
                            </div>
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              onClick={() => handleRemoveBenefit(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="sections" className="space-y-4">
                    <div>
                      <Label>Sections Management</Label>
                      <p className="text-sm text-gray-500 mb-4">
                        Sections are managed through the benefits and guide tabs for now.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="guide" className="space-y-4">
                    <div>
                      <Label htmlFor="buyingGuide">Buying Guide Content</Label>
                      <Textarea 
                        id="buyingGuide" 
                        name="buyingGuide" 
                        value={currentContent.sections?.find(s => s.title === "Buying Guide")?.content || ''} 
                        onChange={(e) => {
                          const newSections = [...(currentContent.sections || [])];
                          const guideIndex = newSections.findIndex(s => s.title === "Buying Guide");
                          
                          if (guideIndex >= 0) {
                            newSections[guideIndex] = {
                              ...newSections[guideIndex],
                              content: e.target.value
                            };
                          } else {
                            newSections.push({
                              id: `guide-${Date.now()}`,
                              title: "Buying Guide",
                              content: e.target.value
                            });
                          }
                          
                          setCurrentContent(prev => ({
                            ...prev,
                            sections: newSections
                          }));
                        }}
                        placeholder="Write a helpful buying guide for visitors looking to purchase products in this category"
                        rows={10}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="faqs" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
                      <Button type="button" variant="outline" onClick={handleAddFaq}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add FAQ
                      </Button>
                    </div>
                    
                    {faqs.length === 0 ? (
                      <div className="text-center p-6 bg-gray-50 rounded-lg">
                        <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-gray-500">No FAQs added yet. Add some frequently asked questions to help your visitors.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {faqs.map((faq, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">FAQ #{index + 1}</h4>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleRemoveFaq(index)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                            
                            <div>
                              <Label htmlFor={`faq-q-${index}`}>Question</Label>
                              <Input 
                                id={`faq-q-${index}`}
                                value={faq.question} 
                                onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                                placeholder="E.g., How often should I use a massage gun?"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`faq-a-${index}`}>Answer</Label>
                              <Textarea 
                                id={`faq-a-${index}`}
                                value={faq.answer} 
                                onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                                placeholder="Provide a detailed answer to the question"
                                rows={3}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-10">
                <AlertCircle className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-lg text-gray-500">Select a category from the list to edit its content</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryContent;
