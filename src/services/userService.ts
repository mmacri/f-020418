
import { toast } from "@/hooks/use-toast";

// User type definitions
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Registration data
export interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

// Login data
export interface LoginData {
  email: string;
  password: string;
}

// Profile update data
export interface ProfileUpdateData {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

// Auth response
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

// Mock user data
let USERS: Array<User & { password: string }> = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@recoveryessentials.com",
    password: "admin123", // In a real app, this would be hashed
    role: "admin",
    avatar: "https://ext.same-assets.com/2651616194/3622592620.jpeg",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Editor User",
    email: "editor@recoveryessentials.com",
    password: "editor123",
    role: "editor",
    createdAt: "2023-01-02T00:00:00Z",
    updatedAt: "2023-01-02T00:00:00Z"
  },
  {
    id: 3,
    name: "Demo User",
    email: "user@example.com",
    password: "password123",
    role: "user",
    createdAt: "2023-01-03T00:00:00Z",
    updatedAt: "2023-01-03T00:00:00Z"
  }
];

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    return null;
  }
};

// Login
export const login = async (data: LoginData): Promise<AuthResponse> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = USERS.find(
    u => u.email.toLowerCase() === data.email.toLowerCase() && u.password === data.password
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
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
  
  // Create a mock JWT token
  const token = `mock-jwt-token-${user.id}-${Date.now()}`;
  
  // Store in localStorage
  localStorage.setItem('currentUser', JSON.stringify(sanitizedUser));
  localStorage.setItem('authToken', token);
  
  toast({
    title: "Login successful",
    description: `Welcome back, ${user.name}!`
  });
  
  return {
    success: true,
    user: sanitizedUser,
    token
  };
};

// Register
export const register = async (data: RegistrationData): Promise<AuthResponse> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user with this email already exists
  const existingUser = USERS.find(u => u.email.toLowerCase() === data.email.toLowerCase());
  
  if (existingUser) {
    return {
      success: false,
      message: "A user with this email already exists"
    };
  }
  
  // Create new user
  const newUser = {
    id: Math.max(...USERS.map(u => u.id)) + 1,
    name: data.name,
    email: data.email,
    password: data.password, // In a real app, this would be hashed
    role: 'user' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  USERS.push(newUser);
  
  // Create a sanitized user object (without password)
  const sanitizedUser: User = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt
  };
  
  // Create a mock JWT token
  const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
  
  // Store in localStorage
  localStorage.setItem('currentUser', JSON.stringify(sanitizedUser));
  localStorage.setItem('authToken', token);
  
  toast({
    title: "Registration successful",
    description: `Welcome, ${newUser.name}!`
  });
  
  return {
    success: true,
    user: sanitizedUser,
    token
  };
};

// Logout
export const logout = async (): Promise<void> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  localStorage.removeItem('currentUser');
  localStorage.removeItem('authToken');
  
  toast({
    title: "Logged out",
    description: "You have been successfully logged out"
  });
};

// Update user profile
export const updateUserProfile = async (data: ProfileUpdateData): Promise<User | null> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Find the user
  const userIndex = USERS.findIndex(u => u.id === data.id);
  
  if (userIndex === -1) {
    toast({
      title: "Error",
      description: "User not found",
      variant: "destructive"
    });
    return null;
  }
  
  // Check if email is already taken by another user
  const emailExists = USERS.some(u => 
    u.id !== data.id && 
    u.email.toLowerCase() === data.email.toLowerCase()
  );
  
  if (emailExists) {
    toast({
      title: "Error",
      description: "Email is already taken by another user",
      variant: "destructive"
    });
    return null;
  }
  
  // Update user data
  USERS[userIndex] = {
    ...USERS[userIndex],
    name: data.name,
    email: data.email,
    avatar: data.avatar,
    updatedAt: new Date().toISOString()
  };
  
  // Create a sanitized user object
  const updatedUser: User = {
    id: USERS[userIndex].id,
    name: USERS[userIndex].name,
    email: USERS[userIndex].email,
    role: USERS[userIndex].role,
    avatar: USERS[userIndex].avatar,
    createdAt: USERS[userIndex].createdAt,
    updatedAt: USERS[userIndex].updatedAt
  };
  
  // Update localStorage
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  
  return updatedUser;
};

// Update user password
export const updateUserPassword = async (
  userId: number, 
  currentPassword: string, 
  newPassword: string
): Promise<boolean> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find the user
  const userIndex = USERS.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    toast({
      title: "Error",
      description: "User not found",
      variant: "destructive"
    });
    return false;
  }
  
  // Verify current password
  if (USERS[userIndex].password !== currentPassword) {
    return false;
  }
  
  // Update password
  USERS[userIndex].password = newPassword;
  USERS[userIndex].updatedAt = new Date().toISOString();
  
  return true;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null && localStorage.getItem('authToken') !== null;
};

// Check if user has admin role
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user !== null && user.role === 'admin';
};

// Check if user has editor role or above
export const isEditorOrAdmin = (): boolean => {
  const user = getCurrentUser();
  return user !== null && (user.role === 'admin' || user.role === 'editor');
};

// Get all users (admin only)
export const getUsers = async (): Promise<User[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, we would check permissions here
  if (!isAdmin()) {
    throw new Error("Unauthorized: Only admins can access user list");
  }
  
  // Return sanitized users (without passwords)
  return USERS.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }));
};
