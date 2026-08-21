'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { authService } from '@/services/auth.service';
import { queryClient } from '@/lib/queryClient';
import { toastSuccess } from '@/utils/toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';

  // Restore auth on mount
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const savedToken = Cookies.get('pet-shop-token');
        const savedUser = Cookies.get('pet-shop-user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));

          // Verify token is still valid
          const { data } = await authService.getMe();
          setUser(data);
          Cookies.set('pet-shop-user', JSON.stringify(data), { expires: 7 });
        }
      } catch {
        // Token expired or invalid
        Cookies.remove('pet-shop-token');
        Cookies.remove('pet-shop-user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreAuth();
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const response = await authService.login({ email, password });
    if (response.success) {
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      Cookies.set('pet-shop-token', userToken, { expires: 7 });
      Cookies.set('pet-shop-user', JSON.stringify(userData), { expires: 7 });
    }
    return response;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const response = await authService.register({ name, email, password });
    if (response.success) {
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      Cookies.set('pet-shop-token', userToken, { expires: 7 });
      Cookies.set('pet-shop-user', JSON.stringify(userData), { expires: 7 });
    }
    return response;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    Cookies.remove('pet-shop-token');
    Cookies.remove('pet-shop-user');
    queryClient.clear(); // Clear all cached React Query queries to isolate data
    toastSuccess('Logged out successfully.');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
