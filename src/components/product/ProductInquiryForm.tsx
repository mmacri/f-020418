
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Check, Info } from 'lucide-react';
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

// Enhanced form schema with Zod for better validation
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name cannot exceed 50 characters' })
    .refine(name => /^[a-zA-Z\s'-]+$/.test(name), {
      message: "Name can only contain letters, spaces, hyphens and apostrophes"
    }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  subject: z
    .string()
    .min(5, { message: 'Subject must be at least 5 characters' })
    .max(100, { message: 'Subject cannot exceed 100 characters' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(1000, { message: 'Message cannot exceed 1000 characters' })
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
  const [characterCount, setCharacterCount] = React.useState(0);

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: `Inquiry about ${productName}`,
      message: ''
    },
    mode: 'onChange' // Enable real-time validation
  });

  // Update character count for message field
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'message') {
        setCharacterCount(value.message?.length || 0);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Clear error when form values change
  useEffect(() => {
    if (formError) {
      setFormError(null);
    }
  }, [form.watch('email'), form.watch('message'), formError]);

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
      form.reset({
        name: '',
        email: '',
        subject: `Inquiry about ${productName}`,
        message: ''
      });
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
    <div className="border rounded-lg p-6 mt-6" aria-labelledby="inquiry-form-title">
      <h3 id="inquiry-form-title" className="text-lg font-semibold mb-4">Ask a Question About This Product</h3>
      
      {formError && (
        <Alert variant="destructive" className="mb-4" role="alert">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate aria-label="Product inquiry form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Your Name</FormLabel>
                  <FormControl>
                    <Input 
                      id="name"
                      placeholder="John Doe" 
                      autoComplete="name"
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.name}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage aria-live="polite" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="your@email.com" 
                      autoComplete="email"
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.email}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage aria-live="polite" />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="subject">Subject</FormLabel>
                <FormControl>
                  <Input 
                    id="subject"
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.subject}
                    {...field} 
                  />
                </FormControl>
                <FormMessage aria-live="polite" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="message">Your Message</FormLabel>
                <FormControl>
                  <Textarea 
                    id="message"
                    placeholder="I have a question about this product..." 
                    className="min-h-[120px]" 
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.message}
                    {...field}
                  />
                </FormControl>
                <div className="flex justify-between">
                  <FormDescription>
                    Please be as specific as possible with your question.
                  </FormDescription>
                  <span className={`text-xs ${characterCount > 900 ? 'text-orange-500' : 'text-gray-500'}`} aria-live="polite">
                    {characterCount}/1000
                  </span>
                </div>
                <FormMessage aria-live="polite" />
              </FormItem>
            )}
          />
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
            <Info className="h-4 w-4" aria-hidden="true" />
            <p>Your information is only used to respond to your inquiry and will not be shared.</p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
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
          <div className="flex items-center justify-center p-4 text-green-600">
            <div className="rounded-full bg-green-100 p-2">
              <Check className="h-8 w-8" aria-hidden="true" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={closeSuccessDialog} autoFocus>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductInquiryForm;
