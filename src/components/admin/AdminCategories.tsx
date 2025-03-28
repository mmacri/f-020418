import React, { useState, useEffect } from "react";
import { 
  getNavigationCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "@/services/categoryService";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminCategoryContent from "./AdminCategoryContent";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getNavigationCategories();
      setCategories(data);
    };
    
    loadCategories();
  }, []);

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
            
            <TabsContent value="structure">
              <div className="space-y-6">
                <p className="text-sm text-gray-500 mb-4">
                  Create, edit, and organize your product categories. Categories are used to group products and organize your navigation.
                </p>
                
                {/* You would implement your category structure UI here */}
                <div className="border rounded-md p-6 bg-gray-50 text-center">
                  <p>Category structure management would be implemented here.</p>
                </div>
              </div>
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
