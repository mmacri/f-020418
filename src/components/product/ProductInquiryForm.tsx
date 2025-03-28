
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' })
});

type FormValues = z.infer<typeof formSchema>;

interface ProductInquiryFormProps {
  productName: string;
  productId: number;
}

const ProductInquiryForm: React.FC<ProductInquiryFormProps> = ({ productName, productId }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: `Inquiry about ${productName}`,
      message: ''
    }
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      console.log('Submitting inquiry:', { ...data, productId });
      
      // In a real application, you would send this data to your backend
      // Simulate API call with a timeout and potential for random error
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional network failures (10% chance)
          if (Math.random() < 0.1) {
            reject(new Error("Network error occurred. Please try again."));
            return;
          }
          resolve(true);
        }, 1000);
      });
      
      // Show success dialog
      setShowSuccessDialog(true);
      
      // Reset the form
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Set form error message
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('An unexpected error occurred. Please try again.');
      }
      
      // Show error toast
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
  };

  return (
    <div className="border rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Ask a Question About This Product</h3>
      
      {formError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Message</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="I have a question about this product..." 
                    className="min-h-[120px]" 
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please be as specific as possible with your question.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Inquiry"}
          </Button>
        </form>
      </Form>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inquiry Submitted Successfully</DialogTitle>
            <DialogDescription>
              Thank you for your inquiry about {productName}. We've received your message and will get back to you shortly at your provided email address.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={closeSuccessDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductInquiryForm;
