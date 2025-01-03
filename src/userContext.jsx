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
    try {
      // Ensure CSRF token is set first
      await fetchCsrfToken();
  
      // Now make the request to get the authenticated user
      const response = await axios.get('http://localhost:8000/api/user', {
        withCredentials: true,
      });
  
      setAuthenticatedUser(response.data); // Update state with user data
      console.log('Authenticated user response:', response.data);
      
    } catch (err) {
      console.error('Failed to fetch authenticated user:', err);
      
      setAuthenticatedUser(false); // Explicitly set to false if unauthenticated
    } finally {
      setIsLoading(false); // Always end loading state
    }
  };
  

  useEffect(() => {
    const fetchUserData = async () => {
      await fetchCsrfToken();
      await fetchAuthenticatedUser();
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Optionally replace with a spinner
  }


  return (
    <UserContext.Provider value={{ authenticatedUser, fetchAuthenticatedUser }}>
                  {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => useContext(UserContext);