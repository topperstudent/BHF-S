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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('bhfs_token');
    const cachedUser = localStorage.getItem('bhfs_user');
    if (token) {
      try {
        const userData = await authAPI.getMe();
        setUser(userData);
        const adminData = await authAPI.isAdmin();
        setIsAdmin(Boolean(adminData?.isAdmin));
      } catch (error) {
        if (cachedUser) {
          try {
            const u = JSON.parse(cachedUser);
            setUser(u);
            setIsAdmin(Boolean(u.isAdmin));
          } catch {
            localStorage.removeItem('bhfs_token');
            localStorage.removeItem('bhfs_user');
            setUser(null);
            setIsAdmin(false);
          }
        } else {
          localStorage.removeItem('bhfs_token');
          setUser(null);
          setIsAdmin(false);
        }
      }
    }
    setLoading(false);
  };

  const signIn = async (identifier: string, password: string) => {
    try {
      const response = await authAPI.login({ identifier, password });
      localStorage.setItem('bhfs_token', response.access_token);
      setUser(response.user);
      setIsAdmin(Boolean(response.isAdmin));
      return response;
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
      localStorage.setItem('bhfs_token', response.access_token);
      setUser(response.user);
      setIsAdmin(Boolean(response.isAdmin));
      return response;
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
