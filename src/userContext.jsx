import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const UserContext = createContext(null);

// Create a provider
export const UserProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCsrfToken = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
      console.log('CSRF token set successfully');
    } catch (err) {
      console.error('Failed to fetch CSRF cookie:', err);
    }
  };

  const fetchAuthenticatedUser = async () => {
    setIsLoading(true); // Start loading
    try {
      await fetchCsrfToken(); // Ensure CSRF token is set
      const response = await axios.get('http://localhost:8000/api/user', {
        withCredentials: true,
      });
      setAuthenticatedUser(response.data); // Update state with user data
      console.log('Authenticated user response:', response.data);
    } catch (err) {
      console.error('Failed to fetch authenticated user:', err);
      setAuthenticatedUser(null); // Explicitly set user to null if unauthenticated
    } 
    setIsLoading(false); // End loading
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:8000/loginn', credentials, {
        withXSRFToken: true,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
  
      const { user } = response.data;
      setAuthenticatedUser(user); // Update the authenticated user state immediately
      return user; // Return user for navigation or further actions
    } catch (error) {
      throw error; // Let the calling component handle the error
    }
  };
  

  const logout = async () => {
    setIsLoading(true); // Start loading
    setAuthenticatedUser(null);
    try {
      await axios.post('http://localhost:8000/logout', {}, {
        withXSRFToken: true,
        withCredentials: true,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setIsLoading(false); // End loading
  };

  // Fetch user data once when the app initializes
  useEffect(() => {
    const initialize = async () => {
      await fetchAuthenticatedUser();
    };
    initialize();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Optionally replace with a spinner
  }

  return (
    <UserContext.Provider value={{ authenticatedUser, fetchAuthenticatedUser, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => useContext(UserContext);
