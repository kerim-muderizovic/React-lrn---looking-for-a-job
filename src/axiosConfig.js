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
    
    // Get the CSRF token from cookies
    const xsrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
      
    if (xsrfToken) {
      // Decode the token (Laravel encodes it)
      const decodedToken = decodeURIComponent(xsrfToken);
      
      // Set it in headers for future requests
      axios.defaults.headers.common['X-XSRF-TOKEN'] = decodedToken;
      
      // Update meta tag if it exists
      const metaToken = document.querySelector('meta[name="csrf-token"]');
      if (metaToken) {
        metaToken.setAttribute('content', decodedToken);
      }
      
      console.log('CSRF token set in headers');
    } else {
      console.warn('No XSRF-TOKEN found in cookies');
    }
  } catch (error) {
    console.error('Error getting CSRF token:', error);
  }
};

// Add a request interceptor for debugging
axios.interceptors.request.use(
  config => {
    // Log the request for debugging
    console.log('Making request to:', config.url, config);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for debugging
axios.interceptors.response.use(
  response => {
    // Log the response for debugging
    console.log('Response from:', response.config.url, response);
    return response;
  },
  error => {
    // Log the error response for debugging
    console.error('Response error:', error.config?.url, error.response || error);
    return Promise.reject(error);
  }
);

// Call it once when the app loads
getCSRFToken();

export default axios; 