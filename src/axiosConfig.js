import axios from 'axios';

// Configure axios with a base URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withXSRFToken = true;

// Function to get CSRF cookie
export const getCSRFToken = async () => {
  try {
    await axios.get('/sanctum/csrf-cookie');
    console.log('CSRF cookie set');
    
    // Get the CSRF token from the meta tag after it's been set
    const token = document.querySelector('meta[name="csrf-token"]');
    if (token) {
      token.setAttribute('content', document.cookie.split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1] || '');
    }
  } catch (error) {
    console.error('Error getting CSRF token:', error);
  }
};

// Call it once when the app loads
getCSRFToken();

export default axios; 