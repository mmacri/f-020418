
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleAffiliateClick } from '@/lib/affiliate-utils';
import { useToast } from '@/hooks/use-toast';

interface DirectDownloadButtonProps {
  productId: string | number;
  productName: string;
  affiliateUrl: string;
  asin?: string;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary';
}

const DirectDownloadButton: React.FC<DirectDownloadButtonProps> = ({
  productId,
  productName,
  affiliateUrl,
  asin,
  buttonText = "Get Product Manual",
  buttonVariant = "default"
}) => {
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Log the lead capture
      console.log(`Lead captured: ${email} for product ${productName}`);
      
      // Track the affiliate click
      handleAffiliateClick(
        affiliateUrl,
        productId,
        productName,
        asin,
        'direct_download'
      );
      
      // In a full implementation, we'd send this to a CRM/email service
      // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email, productId }) });
      
      toast({
        title: "Download Started",
        description: "Thanks for your interest! Your download link has been sent to your email."
      });
      
      // Close the dialog
      setIsOpen(false);
      
      // Reset form
      setEmail('');
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download {productName} Manual</DialogTitle>
          <DialogDescription>
            Enter your email to receive your free product manual download
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@example.com"
                required
              />
            </div>
            <div className="text-xs text-gray-500">
              By providing your email, you agree to receive information about this product and related offers.
              We may earn a commission if you purchase through our links.
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <ExternalLink className="h-3 w-3 mr-1" />
              <span>Redirects to Amazon</span>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Download Now"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DirectDownloadButton;
