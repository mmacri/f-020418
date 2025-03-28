
import { toast } from "@/hooks/use-toast";
import { 
  User, 
  getCurrentUser as getUserFromService, 
  login as userServiceLogin, 
  logout as userServiceLogout,
  isAdmin as checkIsAdmin,
  isEditorOrAdmin as checkIsEditorOrAdmin
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
  
  return {
    success: result.success,
    user: result.user,
    message: result.message
  };
};

// Logout function (wrapper around userService.logout)
export const logout = async (): Promise<void> => {
  await userServiceLogout();
  
  // Redirect to login page after logout
  window.location.href = '/login';
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

// Check if user has editor or admin role
export const isEditorOrAdmin = (): boolean => {
  return checkIsEditorOrAdmin();
};

// Navigate to profile page
export const goToProfile = (): void => {
  window.location.href = '/profile';
};
