
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { login } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .optional()
    .or(z.literal(''))
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange"
  });

  // Clear error message when form values change
  useEffect(() => {
    if (loginError) {
      setLoginError(null);
    }
  }, [form.watch("email"), form.watch("password"), loginError]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      setLoginError(null);
      
      const result = await login(
        values.email,
        values.password || ""
      );
      
      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard"
        });
        navigate("/admin");
      } else {
        setLoginError(result.message || "Invalid admin credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An unexpected error occurred. Please try again.");
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
              Admin Login
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in with your credentials
            </p>
          </div>
          
          {loginError && (
            <Alert variant="destructive" className="animate-in fade-in-50">
              <AlertCircle className="h-4 w-4 mr-2" aria-hidden="true" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate aria-label="Login form">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Admin Email</FormLabel>
                    <FormControl>
                      <Input 
                        id="email"
                        type="email" 
                        placeholder="Enter admin email" 
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
                          placeholder="Enter admin password" 
                          autoComplete="current-password"
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
                  {loading ? "Signing In..." : "Sign In as Admin"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
