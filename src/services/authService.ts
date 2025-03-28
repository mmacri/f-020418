
import { toast } from "@/hooks/use-toast";
import { getCurrentUser, login as userServiceLogin, logout as userServiceLogout } from "@/services/userService";

// User type definition
export interface User {
  id: number;
  email: string;
  role: string;
  name: string;
}

// Authentication result
export interface AuthResult {
  success: boolean;
  user?: User;
  message?: string;
}

// Login function (wrapper around userService.login)
export const login = async (email: string, password: string): Promise<AuthResult> => {
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
export const logout = (): void => {
  userServiceLogout();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Get current user
export const getUser = (): User | null => {
  return getCurrentUser();
};

// Check if user has admin role
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user !== null && user.role === 'admin';
};
