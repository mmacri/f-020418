
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { register as registerUser } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

// Enhanced form validation schema with more detailed requirements
const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .refine(name => /^[a-zA-Z\s'-]+$/.test(name), {
        message: "Name can only contain letters, spaces, hyphens and apostrophes"
      }),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(password => /[A-Z]/.test(password), {
        message: "Password must contain at least one uppercase letter"
      })
      .refine(password => /[0-9]/.test(password), {
        message: "Password must contain at least one number"
      }),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password")
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    mode: "onChange" // Enable real-time validation as user types
  });

  // Clear error message when form values change
  useEffect(() => {
    if (registerError) {
      setRegisterError(null);
    }
  }, [form.watch("email"), registerError]);

  // Password strength indicators
  const password = form.watch("password");
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setLoading(true);
      setRegisterError(null);
      
      const result = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password
      });
      
      if (result.success) {
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully"
        });
        navigate("/");
      } else {
        setRegisterError(result.message || "An error occurred during registration");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" role="main">
      <Header />
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>
          
          {registerError && (
            <Alert variant="destructive" className="animate-in fade-in-50">
              <AlertCircle className="h-4 w-4 mr-2" aria-hidden="true" />
              <AlertDescription>{registerError}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate aria-label="Registration form">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        id="name"
                        placeholder="Enter your full name" 
                        autoComplete="name"
                        aria-required="true"
                        aria-invalid={!!form.formState.errors.name}
                        {...field} 
                      />
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
                    <FormLabel htmlFor="email">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        id="email"
                        type="email" 
                        placeholder="Enter your email" 
                        autoComplete="email"
                        aria-required="true"
                        aria-invalid={!!form.formState.errors.email}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          id="password"
                          type={showPassword ? "text" : "password"} 
                          placeholder="Create a password" 
                          autoComplete="new-password"
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.password}
                          {...field} 
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    
                    {/* Password strength indicator */}
                    {password.length > 0 && (
                      <div className="mt-2 space-y-2" aria-live="polite">
                        <p className="text-xs text-gray-600 font-medium">Password requirements:</p>
                        <ul className="space-y-1 text-xs">
                          <li className="flex items-center">
                            <span className={`inline-flex mr-2 ${hasMinLength ? 'text-green-500' : 'text-gray-400'}`}>
                              {hasMinLength ? <Check className="h-3 w-3" /> : "•"}
                            </span>
                            At least 8 characters
                          </li>
                          <li className="flex items-center">
                            <span className={`inline-flex mr-2 ${hasUppercase ? 'text-green-500' : 'text-gray-400'}`}>
                              {hasUppercase ? <Check className="h-3 w-3" /> : "•"}
                            </span>
                            At least one uppercase letter
                          </li>
                          <li className="flex items-center">
                            <span className={`inline-flex mr-2 ${hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
                              {hasNumber ? <Check className="h-3 w-3" /> : "•"}
                            </span>
                            At least one number
                          </li>
                        </ul>
                      </div>
                    )}
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="Confirm your password" 
                          autoComplete="new-password"
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.confirmPassword}
                          {...field} 
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </Button>
              </div>
            </form>
          </Form>
          
          <div className="mt-6">
            <p className="text-xs text-center text-gray-600">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
