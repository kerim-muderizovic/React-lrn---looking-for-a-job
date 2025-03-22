import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct way for React 18+
import './index.css';
import App from './App.jsx';
import Pusher from 'pusher-js';

// Make Pusher available globally and set the key
window.Pusher = Pusher;

// Initialize Pusher library 
Pusher.logToConsole = true; // Enable logging for debugging

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
