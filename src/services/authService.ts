
// This file is maintained for backward compatibility
// It re-exports all functions from the new modularized auth structure

import {
  login,
  logout,
  getUser,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  isAuthenticatedAdmin
} from './auth';

// Re-export everything
export {
  login,
  logout,
  getUser,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  isAuthenticatedAdmin
};
