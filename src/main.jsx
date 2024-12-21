import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct way for React 18+
import './index.css';
import App from './App.jsx';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
