import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import type { User, AuthContextType } from '@/types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储的登录状态
    const isLogin = localStorage.getItem('isLogin');
    if (isLogin === 'true') {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const userData = await authService.login(username, password);
      setUser(userData);
      localStorage.setItem('isLogin', 'true');
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      await authService.register(data);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('isLogin');
  };

  const refreshUser = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
