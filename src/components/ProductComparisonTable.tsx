
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, Minus, Star, Save, ChevronsUpDown, Plus, X } from 'lucide-react';
import { Product } from '@/services/productService';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/product-utils';
import { handleAffiliateClick } from '@/lib/affiliate-utils';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import { localStorageKeys } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { getProductImageUrl } from '@/lib/images'; 

interface ProductComparisonTableProps {
  products: Product[];
  showReviewLink?: boolean;
  highlightBestProduct?: boolean;
}

interface ComparisonSpec {
  name: string;
  isVisible: boolean;
}

interface SavedComparison {
  id: string;
  name: string;
  productIds: number[];
  visibleSpecs: string[];
  dateCreated: string;
}

const ProductComparisonTable: React.FC<ProductComparisonTableProps> = ({ 
  products, 
  showReviewLink = true,
  highlightBestProduct = false
}) => {
  const { toast } = useToast();
  const [comparisonName, setComparisonName] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Get common specifications keys
  const getSpecKeys = () => {
    const allKeys = new Set<string>();
    
    products.forEach(product => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach(key => allKeys.add(key));
      }
    });
    
    // Prioritize important specs
    const priorityKeys = [
      'Brand', 'Model', 'Weight', 'Dimensions', 'Power', 'Battery Life',
      'Speed Settings', 'Attachments', 'Warranty', 'Noise Level', 'Best For'
    ];
    
    const sortedKeys = [...allKeys].sort((a, b) => {
      const indexA = priorityKeys.indexOf(a);
      const indexB = priorityKeys.indexOf(b);
      
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
    
    return sortedKeys;
  };
  
  const allSpecKeys = getSpecKeys();
  const [visibleSpecs, setVisibleSpecs] = useState<Record<string, boolean>>(
    allSpecKeys.reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );
  
  const toggleSpecVisibility = (specName: string) => {
    setVisibleSpecs(prev => ({
      ...prev,
      [specName]: !prev[specName]
    }));
  };
  
  const saveComparisonSet = () => {
    if (!comparisonName.trim()) {
      toast({
        title: "Name Required",
        description: "Please provide a name for this comparison set.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Get existing comparisons from localStorage
      const savedComparisonsJson = localStorage.getItem(localStorageKeys.COMPARISON_PRODUCTS);
      const savedComparisons: SavedComparison[] = savedComparisonsJson ? 
        JSON.parse(savedComparisonsJson) : [];
      
      // Create new comparison object
      const newComparison: SavedComparison = {
        id: Date.now().toString(),
        name: comparisonName.trim(),
        productIds: products.map(p => p.id),
        visibleSpecs: Object.entries(visibleSpecs)
          .filter(([_, isVisible]) => isVisible)
          .map(([name]) => name),
        dateCreated: new Date().toISOString()
      };
      
      // Add to saved comparisons
      savedComparisons.push(newComparison);
      
      // Save back to localStorage
      localStorage.setItem(
        localStorageKeys.COMPARISON_PRODUCTS, 
        JSON.stringify(savedComparisons)
      );
      
      toast({
        title: "Comparison Saved",
        description: `"${comparisonName}" has been saved to your comparisons.`,
      });
      
      setComparisonName('');
      setIsSaving(false);
    } catch (error) {
      console.error("Error saving comparison:", error);
      toast({
        title: "Error Saving",
        description: "There was a problem saving your comparison.",
        variant: "destructive"
      });
    }
  };
  
  const visibleSpecKeys = allSpecKeys.filter(key => visibleSpecs[key]);
  
  // Find the best product (highest rating)
  const bestProductId = highlightBestProduct ? 
    [...products].sort((a, b) => b.rating - a.rating)[0]?.id : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold">Comparing {products.length} Products</h2>
          <p className="text-sm text-gray-500">
            {visibleSpecKeys.length} of {allSpecKeys.length} specifications visible
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {isSaving ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={comparisonName}
                onChange={(e) => setComparisonName(e.target.value)}
                placeholder="Name this comparison"
                className="px-3 py-1 border rounded text-sm"
              />
              <Button size="sm" onClick={saveComparisonSet}>
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsSaving(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsSaving(true)}>
              <Save className="h-4 w-4 mr-1" /> Save Comparison
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <ChevronsUpDown className="h-4 w-4 mr-1" /> Customize
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {allSpecKeys.map(spec => (
                <DropdownMenuCheckboxItem
                  key={spec}
                  checked={visibleSpecs[spec]}
                  onCheckedChange={() => toggleSpecVisibility(spec)}
                >
                  {spec}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="w-48">Product</TableHead>
              {products.map(product => (
                <TableHead 
                  key={product.id} 
                  className={`w-48 text-center ${product.id === bestProductId ? 'bg-amber-50' : ''}`}
                >
                  <div className="flex flex-col items-center space-y-2 p-2">
                    {product.id === bestProductId && (
                      <div className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full mb-1">
                        Top Rated
                      </div>
                    )}
                    <div className="h-24 flex items-center justify-center">
                      <img 
                        src={getProductImageUrl(product)}
                        alt={product.name} 
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>
                    <Link to={`/products/${product.slug}`} className="font-bold hover:text-indigo-600 text-sm">
                      {product.name}
                    </Link>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Price</TableCell>
              {products.map(product => (
                <TableCell 
                  key={product.id} 
                  className={`text-center font-bold text-indigo-600 ${product.id === bestProductId ? 'bg-amber-50' : ''}`}
                >
                  {formatPrice(product.price)}
                </TableCell>
              ))}
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium">Rating</TableCell>
              {products.map(product => (
                <TableCell 
                  key={product.id} 
                  className={`text-center ${product.id === bestProductId ? 'bg-amber-50' : ''}`}
                >
                  <div className="flex items-center justify-center">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'fill-gray-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-sm">({product.reviewCount})</span>
                  </div>
                </TableCell>
              ))}
            </TableRow>
            
            {visibleSpecKeys.map(key => (
              <TableRow key={key}>
                <TableCell className="font-medium">{key}</TableCell>
                {products.map(product => (
                  <TableCell 
                    key={product.id} 
                    className={`text-center ${product.id === bestProductId ? 'bg-amber-50' : ''}`}
                  >
                    {product.specifications && product.specifications[key] 
                      ? product.specifications[key] 
                      : <Minus className="mx-auto h-4 w-4 text-gray-300" />
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
            
            <TableRow>
              <TableCell className="font-medium">Key Features</TableCell>
              {products.map(product => (
                <TableCell key={product.id} className={product.id === bestProductId ? 'bg-amber-50' : ''}>
                  {product.features && product.features.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {product.features.slice(0, 3).map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                      {product.features.length > 3 && <li>+ {product.features.length - 3} more</li>}
                    </ul>
                  ) : (
                    <span className="text-gray-400">No features listed</span>
                  )}
                </TableCell>
              ))}
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium">Pros</TableCell>
              {products.map(product => (
                <TableCell key={product.id} className={product.id === bestProductId ? 'bg-amber-50' : ''}>
                  {product.pros && product.pros.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {product.pros.slice(0, 3).map((pro, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">No pros listed</span>
                  )}
                </TableCell>
              ))}
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium">Actions</TableCell>
              {products.map(product => (
                <TableCell key={product.id} className={`text-center ${product.id === bestProductId ? 'bg-amber-50' : ''}`}>
                  <div className="flex flex-col space-y-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        const url = product.affiliateLink || product.affiliateUrl || 
                          (product.asin ? `https://www.amazon.com/dp/${product.asin}?tag=recoveryessentials-20` : '#');
                        handleAffiliateClick(url, product.id, product.name, product.asin);
                      }}
                      className="w-full"
                    >
                      View on Amazon
                    </Button>
                    
                    {showReviewLink && (
                      <Button size="sm" variant="outline" asChild className="w-full">
                        <Link to={`/products/${product.slug}`}>Read Review</Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductComparisonTable;
