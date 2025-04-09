import axios from 'axios';

// Base URL configuration - points to the deployed backend
export const API_BASE_URL = 'https://journety-craft-backend.onrender.com';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout for requests
});

// Add a request interceptor to attach the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error: Backend server may be down or unreachable');
    }
    // Handle 401 Unauthorized errors
    else if (error.response.status === 401) {
      console.log('Authentication error - logging out');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use window.location for hard redirect rather than navigate
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;