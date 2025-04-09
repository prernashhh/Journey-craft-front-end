import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        // Set the token on our API instance
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/api/auth/login', { email, password });
      
      const { user: loggedInUser, token } = response.data;
      
      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', token);
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return response.data;
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.error || 'Authentication failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/api/auth/register', userData);
      
      const { user: newUser, token } = response.data.data;
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', token);
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return response.data;
    } catch (err) {
      console.error('Signup error:', err);
      const errorMsg = err.response?.data?.error || 'Registration failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    // Clear the authorization header
    delete api.defaults.headers.common['Authorization'];
  };

  // Provide the context to children components
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
