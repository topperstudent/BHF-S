import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, type User } from '../lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (identifier: string, password: string) => Promise<any>;
  signUp: (phone: string, password: string, userData: { name: string; address?: string; email?: string }) => Promise<any>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

// Strict check: ONLY phone 8888092855 is admin
const verifyAdminPhone = (user: User | null): boolean => {
  if (!user) return false;
  const cleanPhone = (user.phone || '').replace(/[^0-9]/g, '');
  return cleanPhone.endsWith('8888092855');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state directly from localStorage so on reload the user is immediately available!
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem('bhfs_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const cached = localStorage.getItem('bhfs_user');
      if (!cached) return false;
      const u = JSON.parse(cached);
      return Boolean(u.isAdmin && verifyAdminPhone(u));
    } catch {
      return false;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('bhfs_token');
    const cachedUser = localStorage.getItem('bhfs_user');

    if (cachedUser) {
      try {
        const u = JSON.parse(cachedUser);
        setUser(u);
        setIsAdmin(Boolean(u.isAdmin && verifyAdminPhone(u)));
      } catch (err) {
        console.error('Error parsing cached user', err);
      }
    }

    if (token) {
      try {
        const userData = await authAPI.getMe();
        if (userData && userData.uid) {
          const isRealAdmin = Boolean(userData.isAdmin && verifyAdminPhone(userData));
          const updatedUser = { ...userData, isAdmin: isRealAdmin };
          setUser(updatedUser);
          setIsAdmin(isRealAdmin);
          localStorage.setItem('bhfs_user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        // If API is down or running on Vercel without backend, keep local session
        console.log('Using persistent user session');
      }
    } else {
      setUser(null);
      setIsAdmin(false);
    }
    setLoading(false);
  };

  const signIn = async (identifier: string, password: string) => {
    try {
      const response = await authAPI.login({ identifier, password });
      const isRealAdmin = Boolean(response.isAdmin && verifyAdminPhone(response.user));
      const userObj = { ...response.user, isAdmin: isRealAdmin };

      localStorage.setItem('bhfs_token', response.access_token);
      localStorage.setItem('bhfs_user', JSON.stringify(userObj));
      setUser(userObj);
      setIsAdmin(isRealAdmin);
      return { ...response, isAdmin: isRealAdmin, user: userObj };
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Login failed';
      throw new Error(message);
    }
  };

  const signUp = async (
    phone: string,
    password: string,
    userData: { name: string; address?: string; email?: string }
  ) => {
    try {
      const response = await authAPI.signup({
        phone,
        password,
        ...userData,
      });

      // Regular signups are NEVER admin!
      const userObj = { ...response.user, isAdmin: false };

      localStorage.setItem('bhfs_token', response.access_token);
      localStorage.setItem('bhfs_user', JSON.stringify(userObj));
      setUser(userObj);
      setIsAdmin(false);
      return { ...response, isAdmin: false, user: userObj };
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Signup failed';
      throw new Error(message);
    }
  };

  const signOut = () => {
    localStorage.removeItem('bhfs_token');
    localStorage.removeItem('bhfs_user');
    setUser(null);
    setIsAdmin(false);
    toast.success('Signed out successfully');
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  const value = {
    user,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
