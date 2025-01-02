import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const UserContext = createContext();

// Create a provider
export const UserProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Fetch the CSRF token
  const fetchCsrfToken = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
      console.log('CSRF token set successfully');
    } catch (err) {
      console.error('Failed to fetch CSRF cookie:', err);
    }
  };

  // Fetch the authenticated user
  const fetchAuthenticatedUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user', { withCredentials: true });
      setAuthenticatedUser(response.data); // Update state with user data
    } catch (err) {
      console.error('Failed to fetch authenticated user:', err);
      setAuthenticatedUser(false); // Explicitly set to false if unauthenticated
    }
  };

  useEffect(() => {
    // Set CSRF token and fetch user on component mount
    const fetchUserData = async () => {
      await fetchCsrfToken();
      await fetchAuthenticatedUser();
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ authenticatedUser, fetchAuthenticatedUser, isLoading,setIsLoading }}>
                  {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => useContext(UserContext);
