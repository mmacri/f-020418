
import { User, getCurrentUser as getUserFromService, login as userServiceLogin, logout as userServiceLogout } from "@/services/userService";

// Re-export getCurrentUser from userService
export const getCurrentUser = getUserFromService;

// Legacy login function
export const login = userServiceLogin;

// Legacy logout function
export const logout = userServiceLogout;
