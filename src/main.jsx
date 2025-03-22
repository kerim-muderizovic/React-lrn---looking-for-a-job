import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct way for React 18+
import './index.css';
import App from './App.jsx';
import Pusher from 'pusher-js';
import { getCSRFToken } from './axiosConfig';

// Make Pusher available globally and set the key
window.Pusher = Pusher;

// Initialize Pusher library 
Pusher.logToConsole = true; // Enable logging for debugging

// Get CSRF token before mounting the app
(async () => {
  try {
    await getCSRFToken();
    console.log('CSRF token fetched, mounting app');
    
    const rootElement = document.getElementById('root');
    const root = createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Error initializing app:', error);
  }
})();
