// client/src/services/api.js

import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api', // Adjust if your backend runs on a different port or domain
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle token refresh and unauthorized errors
api.interceptors.response.use(
  (response) => response, // If response is successful, just return it
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 Unauthorized and it's not the refresh token endpoint itself,
    // and we haven't already tried to refresh the token for this request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, force logout
          localStorage.clear();
          window.location.href = '/login'; // Redirect to login
          return Promise.reject(error);
        }

        // Request a new access token using the refresh token
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'}/auth/refresh-token`, {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = res.data;

        // Store the new tokens
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update the original request's header with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Refresh token failed, clear all tokens and redirect to login
        localStorage.clear();
        window.location.href = '/login'; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    // For any other error, or if refresh already failed/was attempted
    return Promise.reject(error);
  }
);

export default api;