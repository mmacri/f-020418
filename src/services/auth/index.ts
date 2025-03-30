
// Main auth service index file
import { login as supabaseLogin, logout as supabaseLogout, getUser as supabaseGetUser } from './supabaseAuth';
import { getCurrentUser } from './legacyAuth';
import { isAuthenticated, isAdmin, isAuthenticatedAdmin } from './authUtils';

// Export the enhanced auth functions
export const login = supabaseLogin;
export const logout = supabaseLogout;
export const getUser = supabaseGetUser;

// Re-export utility functions
export {
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  isAuthenticatedAdmin
};
