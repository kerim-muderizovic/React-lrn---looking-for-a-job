import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const UserContext = createContext();

// Create a provider
export const UserProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  // Fetch the CSRF token
  const fetchCsrfToken = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie', {
        withCredentials: true, // Required to send cookies with requests
      });
      console.log('CSRF token set successfully');
    } catch (err) {
      console.error('Failed to fetch CSRF cookie:', err);
    }
  };

  // Fetch the authenticated user (simulate or use API if available)
  const fetchAuthenticatedUser = async () => {
    try {
      const response = await axios.get('/api/user', { withCredentials: true });
      setAuthenticatedUser(response.data); // Update state with user data
    } catch (err) {
      console.error('Failed to fetch authenticated user:', err);
    }
  };

  useEffect(() => {
    // Set CSRF token and fetch user on component mount
    fetchCsrfToken();
    fetchAuthenticatedUser();
  }, []);

  return (
    <UserContext.Provider value={{ authenticatedUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => useContext(UserContext);
