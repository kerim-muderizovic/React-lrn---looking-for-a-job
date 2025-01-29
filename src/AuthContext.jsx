import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null); // Store the authenticated user
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [loading, setLoading] = useState(false); // Central loading state
  // Fetch CSRF token
  const fetchCsrfToken = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
      console.log('CSRF token fetched successfully');
    } catch (err) {
      console.error('Failed to fetch CSRF token:', err);
    }
  };

  // Fetch authenticated user
  const fetchAuthenticatedUser = async () => {
    setIsLoading(true);
    try {
      await fetchCsrfToken();
      const response = await axios.get('http://localhost:8000/auth/check', {
        withCredentials: true,
      });
      setAuthUser(response.data); // Update user state
      console.log('Authenticated user fetched:', response.data);
    } catch (err) {
      console.error('Failed to fetch authenticated user:', err);
      setAuthUser(null); // Clear user if unauthenticated
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true); // Start global loading
    try {
      const response = await axios.post('http://localhost:8000/loginn', credentials, {
        withXSRFToken: true,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      // const { user } = response.data;
      console.log(response.data);
      setAuthUser(response.data); // Update user state
      return response.data;
    } catch (error) {
      throw error; // Let the component handle errors
    } finally {
      setLoading(false); // Stop global loading
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.post('http://localhost:8000/logout', {}, {
        withXSRFToken: true,
        withCredentials: true,
      });
      setAuthUser(null); // Clear user state
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setIsLoading(false);
  };

  // Initialize user data on mount

  // Provide loading state while initializing
  if (isLoading) {
    return <div>Loading...</div>; // Replace with a spinner or loading component
  }

  return (
    <AuthContext.Provider value={{ authUser, login, logout, fetchAuthenticatedUser, isLoading ,setAuthUser,loading,setLoading}}>
      {children}
    </AuthContext.Provider>
  );
};
