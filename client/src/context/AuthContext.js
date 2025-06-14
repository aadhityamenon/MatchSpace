// client/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api'; // Ensure this path is correct

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state to explicitly track authentication status
  const [loading, setLoading] = useState(true); // Tracks initial load, not ongoing API calls

  // Function to load user from token
  // Use useCallback to memoize and prevent unnecessary re-renders/re-creations
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Use the /api/auth/me endpoint from your server
        // The api interceptor will automatically add the token
        const res = await api.get('/auth/me'); // Corrected endpoint as per your authroutes.js
        setCurrentUser(res.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        // If token is invalid or expired, /auth/me will return 401.
        // The api interceptor will try to refresh. If refresh fails,
        // it will clear localStorage and redirect to login.
        // So, here we just ensure state is cleared if something goes wrong.
        console.error("Failed to load user or token invalid:", err);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken'); // Ensure refresh token is also cleared
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Ensure loading is set to false after initial check
      }
    } else {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setLoading(false); // No token, so stop loading immediately
    }
  }, []); // Empty dependency array means this function is created once

  // Initial check on component mount
  useEffect(() => {
    loadUser();
  }, [loadUser]); // Depend on loadUser to ensure it's called if loadUser somehow changes (unlikely with useCallback here)

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      // Store both access token and refresh token
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('refreshToken', res.data.refreshToken); // Store refresh token
      setCurrentUser(res.data.user);
      setIsAuthenticated(true);
      return res.data.user; // Return user data for component
    } catch (err) {
      console.error("Login error:", err.response?.data?.message || err.message);
      // Re-throw the specific error message from the backend
      throw err.response?.data?.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      // Store both access token and refresh token
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('refreshToken', res.data.refreshToken); // Store refresh token
      setCurrentUser(res.data.user);
      setIsAuthenticated(true);
      return res.data.user; // Return user data for component
    } catch (err) {
      console.error("Register error:", err.response?.data?.message || err.message);
      // Re-throw the specific error message from the backend
      throw err.response?.data?.message || 'Registration failed';
    }
  };

  const logout = async () => {
    try {
      // Call your backend logout endpoint to invalidate the refresh token on the server
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Error logging out on server:", error);
      // Even if server logout fails, clear client state
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken'); // IMPORTANT: Also remove the refresh token
      setCurrentUser(null);
      setIsAuthenticated(false);
      // Optionally, redirect here if you don't do it in App.js
      // window.location.href = '/login';
    }
  };

  const value = {
    currentUser,
    isAuthenticated, // Expose isAuthenticated state
    loading,
    login,
    register,
    logout,
    loadUser // Expose loadUser for manual re-fetching if needed (e.g., after profile update)
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children when initial loading is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};