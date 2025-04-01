
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { WishlistProvider } from "@/hooks/useWishlist";
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Blog from "@/pages/Blog";
import BlogPostPage from "@/pages/BlogPost";
import RecoveryApps from "@/pages/RecoveryApps";
import Search from "@/pages/Search";
import Newsletter from "@/pages/Newsletter";
import ProductDetail from "@/pages/ProductDetail";
import CategoryPage from "@/pages/CategoryPage";
import AllCategoriesPage from "@/pages/AllCategoriesPage";
import AllProductsPage from "@/pages/AllProductsPage";
import SubcategoryPage from "@/pages/SubcategoryPage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import AffiliateDisclosure from "@/pages/AffiliateDisclosure";
import Admin from "@/pages/Admin";
import WorkflowDemo from "@/pages/WorkflowDemo";
import AutoWorkflowDemo from "@/pages/AutoWorkflowDemo";
import NotFound from "@/pages/NotFound";
import ProductComparisonPage from "@/pages/ProductComparisonPage";
import Wishlist from "@/pages/Wishlist";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import ProfilePage from "@/pages/ProfilePage";
import FriendRequestsPage from "@/pages/FriendRequestsPage";
import initPolyfills from "@/lib/browser-polyfills";
import { Toaster } from "@/components/ui/toaster";

function App() {
  useEffect(() => {
    // Initialize browser polyfills for older browsers
    initPolyfills();
  }, []);

  return (
    <ThemeProvider>
      <WishlistProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/recovery-apps" element={<RecoveryApps />} />
            <Route path="/search" element={<Search />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/product-comparison" element={<ProductComparisonPage />} />
            <Route path="/product-comparison/:category" element={<ProductComparisonPage />} />
            <Route path="/wishlist" element={<Wishlist />} />

            {/* Profile routes */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/profile/requests" element={<FriendRequestsPage />} />
            <Route path="/account" element={<Profile />} />

            {/* Product routes */}
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/products" element={<AllProductsPage />} />
            
            {/* Category routes */}
            <Route path="/categories" element={<AllCategoriesPage />} />
            <Route path="/categories/:categorySlug" element={<CategoryPage />} />
            <Route path="/categories/:categorySlug/:subSlug" element={<SubcategoryPage />} />

            {/* Legal pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
            
            {/* Admin routes */}
            <Route path="/admin/*" element={<Admin />} />
            
            {/* Demo routes */}
            <Route path="/workflow-demo" element={<WorkflowDemo />} />
            <Route path="/auto-workflow-demo" element={<AutoWorkflowDemo />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </WishlistProvider>
    </ThemeProvider>
  );
}

export default App;
