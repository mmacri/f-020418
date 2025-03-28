
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { isAuthenticated } from '@/services/userService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

interface SaveForLaterProps {
  productId: number;
  productName: string;
}

const SaveForLater: React.FC<SaveForLaterProps> = ({ productId, productName }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if product is saved
  const { data: isSaved, isLoading } = useQuery({
    queryKey: ['savedProduct', productId],
    queryFn: async () => {
      if (!isAuthenticated()) return false;
      
      try {
        // In production this would be a real API call
        // For now, we'll check localStorage
        const savedItems = JSON.parse(localStorage.getItem('savedProducts') || '[]');
        return savedItems.includes(productId);
      } catch (error) {
        console.error("Error checking saved status:", error);
        return false;
      }
    },
    enabled: isAuthenticated(),
  });

  // Toggle save/unsave
  const toggleSaveMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated()) {
        throw new Error("User not authenticated");
      }
      
      // In production this would be a real API call
      // For development, we'll use localStorage
      try {
        const savedItems = JSON.parse(localStorage.getItem('savedProducts') || '[]');
        
        if (savedItems.includes(productId)) {
          // Remove from saved
          const updatedItems = savedItems.filter((id: number) => id !== productId);
          localStorage.setItem('savedProducts', JSON.stringify(updatedItems));
          return { saved: false };
        } else {
          // Add to saved
          savedItems.push(productId);
          localStorage.setItem('savedProducts', JSON.stringify(savedItems));
          return { saved: true };
        }
      } catch (error) {
        console.error("Error toggling saved status:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['savedProduct', productId] });
      queryClient.invalidateQueries({ queryKey: ['savedProducts'] });
      
      toast({
        title: data.saved ? "Saved to Wishlist" : "Removed from Wishlist",
        description: data.saved 
          ? `${productName} has been added to your wishlist` 
          : `${productName} has been removed from your wishlist`
      });
    },
    onError: () => {
      if (!isAuthenticated()) {
        toast({
          title: "Login Required",
          description: "Please login to save products to your wishlist",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "There was an error updating your wishlist",
          variant: "destructive"
        });
      }
    }
  });

  const handleToggleSave = () => {
    toggleSaveMutation.mutate();
  };

  return (
    <Button
      variant={isSaved ? "default" : "outline"}
      size="sm"
      className={`flex items-center ${isSaved ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' : ''}`}
      onClick={handleToggleSave}
      disabled={toggleSaveMutation.isPending || isLoading}
    >
      <Heart className={`h-4 w-4 mr-1 ${isSaved ? 'fill-indigo-500' : ''}`} />
      {toggleSaveMutation.isPending ? 'Updating...' : (isSaved ? 'Saved' : 'Save for Later')}
    </Button>
  );
};

export default SaveForLater;
