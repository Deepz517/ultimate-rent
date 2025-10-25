import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface User {
  username: string;
  role: 'LANDLORD' | 'TENANT';
  tenantId?: number; // Added tenantId for tenant users
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username, password) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        // You can add token expiration check here
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Invalid token/user from storage", error);
        localStorage.clear();
        setUser(null);
        setToken(null);
      }
    }
  }, [token]);

  const login = async (username, password) => {
    const response = await api.post('/authenticate', { username, password });
    const { jwt } = response.data;

    // Using the token from the response for the next request
    const userResponse = await api.get(`/api/users/username/${username}`, {
        headers: { Authorization: `Bearer ${jwt}` }
    });

    const userData: User = userResponse.data;

    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);

    if (userData.role === 'LANDLORD') {
      navigate('/landlord');
    } else {
      navigate('/tenant');
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
