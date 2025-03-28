
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";

// Import all the pages needed
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import AffiliateDisclosure from "./pages/AffiliateDisclosure";
import Newsletter from "./pages/Newsletter";
import ProductComparison from "./pages/ProductComparison";
import RecoveryApps from "./pages/RecoveryApps";
import Admin from "./pages/Admin";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import WorkflowDemo from "./pages/WorkflowDemo";

// Configure React Query with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Category pages */}
          <Route path="/categories/:categorySlug" element={<CategoryPage />} />
          <Route path="/categories/:categorySlug/:subcategorySlug" element={<CategoryPage />} />
          
          {/* Product pages */}
          <Route path="/products/:productSlug" element={<ProductDetail />} />
          <Route path="/products/comparison" element={<ProductComparison />} />
          <Route path="/wishlist" element={<Wishlist />} />
          
          {/* Blog pages */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:articleSlug" element={<BlogPost />} />
          
          {/* Authentication pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Company/Info pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
          
          {/* Additional pages */}
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/recovery-apps" element={<RecoveryApps />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/workflow" element={<WorkflowDemo />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
