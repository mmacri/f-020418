import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localStorageKeys } from '@/lib/constants';

interface SaveForLaterProps {
  productId: string;
  productName: string;
}

const SaveForLater: React.FC<SaveForLaterProps> = ({ productId, productName }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    try {
      const savedItems = JSON.parse(localStorage.getItem(localStorageKeys.WISHLIST_ITEMS) || '[]');
      setIsSaved(savedItems.includes(productId));
    } catch (error) {
      console.error("Error loading saved items:", error);
    }
  }, [productId]);

  const toggleSaveMutation = useMutation({
    mutationFn: async () => {
      try {
        const savedItems = JSON.parse(localStorage.getItem(localStorageKeys.WISHLIST_ITEMS) || '[]');
        
        if (savedItems.includes(productId)) {
          const updatedItems = savedItems.filter((id: string) => id !== productId);
          localStorage.setItem(localStorageKeys.WISHLIST_ITEMS, JSON.stringify(updatedItems));
          return { saved: false };
        } else {
          savedItems.push(productId);
          localStorage.setItem(localStorageKeys.WISHLIST_ITEMS, JSON.stringify(savedItems));
          return { saved: true };
        }
      } catch (error) {
        console.error("Error toggling saved status:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      setIsSaved(data.saved);
      toast({
        title: data.saved ? "Saved to Wishlist" : "Removed from Wishlist",
        description: data.saved 
          ? `${productName} has been added to your wishlist` 
          : `${productName} has been removed from your wishlist`,
        variant: data.saved ? "default" : "destructive"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error updating your wishlist",
        variant: "destructive"
      });
    }
  });

  const handleToggleSave = () => {
    toggleSaveMutation.mutate();
  };

  return (
    <Button
      variant={isSaved ? "default" : "outline"}
      size="sm"
      className={`flex items-center gap-1.5 transition-all ${
        isSaved 
          ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800' 
          : 'hover:bg-gray-100'
      }`}
      onClick={handleToggleSave}
      disabled={toggleSaveMutation.isPending}
    >
      <Heart 
        className={`h-4 w-4 ${isSaved ? 'fill-indigo-500 text-indigo-500' : ''} 
        ${toggleSaveMutation.isPending ? 'animate-pulse' : ''}`} 
      />
      {toggleSaveMutation.isPending 
        ? 'Updating...' 
        : (isSaved ? 'Saved' : 'Save for Later')}
    </Button>
  );
};

export default SaveForLater;
