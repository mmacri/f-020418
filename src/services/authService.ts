
import { toast } from "@/hooks/use-toast";
import { 
  User, 
  getCurrentUser as getUserFromService, 
  login as userServiceLogin, 
  logout as userServiceLogout,
  isAdmin as checkIsAdmin
} from "@/services/userService";

// Re-export getCurrentUser from userService
export const getCurrentUser = getUserFromService;

// Login function (wrapper around userService.login)
export const login = async (email: string, password: string): Promise<{
  success: boolean;
  user?: User;
  message?: string;
}> => {
  const result = await userServiceLogin({
    email: email,
    password: password
  });
  
  // Only allow admin users to login
  if (result.success && result.user && result.user.role !== 'admin') {
    return {
      success: false,
      message: "Only administrators can log in to this application."
    };
  }
  
  return {
    success: result.success,
    user: result.user,
    message: result.message
  };
};

// Logout function (wrapper around userService.logout)
export const logout = async (): Promise<void> => {
  await userServiceLogout();
  
  // Redirect to home page after logout
  window.location.href = '/';
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null && localStorage.getItem('authToken') !== null;
};

// Get current user
export const getUser = (): User | null => {
  return getCurrentUser();
};

// Check if user has admin role
export const isAdmin = (): boolean => {
  return checkIsAdmin();
};

// Check if user is an admin and authenticated
export const isAuthenticatedAdmin = (): boolean => {
  return isAuthenticated() && isAdmin();
};
