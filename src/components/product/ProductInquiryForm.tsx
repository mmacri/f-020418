
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

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
    console.log('Form data:', { ...data, productId });
    
    // In a real application, you would send this data to your backend
    // Simulate API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success toast
    toast({
      title: "Inquiry Sent",
      description: "We've received your inquiry and will get back to you soon.",
    });
    
    // Reset the form
    form.reset();
  };

  return (
    <div className="border rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Ask a Question About This Product</h3>
      
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
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Sending..." : "Send Inquiry"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProductInquiryForm;
