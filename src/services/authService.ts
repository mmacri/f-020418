
import { toast } from "@/hooks/use-toast";

// In a real application, this would be stored in a database
const DEMO_USERS = [
  {
    id: 1,
    email: "admin@recoveryessentials.com",
    password: "admin123", // In a real app, this would be hashed
    role: "admin",
    name: "Admin User"
  },
  {
    id: 2,
    email: "user@example.com",
    password: "password123",
    role: "user",
    name: "Demo User"
  }
];

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

// Store the current user in localStorage
const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    return null;
  }
};

// Login function
export const login = (email: string, password: string): AuthResult => {
  // Find the user
  const user = DEMO_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (!user) {
    return { 
      success: false, 
      message: "Invalid email or password" 
    };
  }
  
  // Create a sanitized user object (without password)
  const sanitizedUser: User = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };
  
  // Store in localStorage
  localStorage.setItem('currentUser', JSON.stringify(sanitizedUser));
  
  return {
    success: true,
    user: sanitizedUser
  };
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('currentUser');
  toast({
    title: "Logged out",
    description: "You have been successfully logged out"
  });
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
