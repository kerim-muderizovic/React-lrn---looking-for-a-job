import axios from 'axios';

// Configure axios with a base URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
axios.defaults.withCredentials = true;

export default axios; 