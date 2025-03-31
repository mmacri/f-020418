
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkX } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuthentication } from '@/hooks/useAuthentication';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SaveForLaterProps {
  productId: string | number;
  productName?: string; // Make productName optional
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
}

const SaveForLater = ({ productId, productName, className, variant = 'outline' }: SaveForLaterProps) => {
  const { isInWishlist, addToWishlist, removeFromWishlist, isPending } = useWishlist();
  const { isAuthenticated } = useAuthentication();
  const navigate = useNavigate();
  
  const saved = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please login to bookmark products");
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    if (saved) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return (
    <Button 
      variant={variant}
      size="sm"
      className={className}
      onClick={handleClick}
      disabled={isPending}
    >
      {saved ? (
        <>
          <BookmarkX className="h-4 w-4 mr-2" />
          Remove Bookmark
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4 mr-2" />
          Bookmark
        </>
      )}
    </Button>
  );
};

export default SaveForLater;
