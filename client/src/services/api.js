// MatchSpace/client/src/services/api.js

import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  // This URL MUST match your backend server's address and API prefix
  // It will read from process.env.REACT_APP_API_URL (set in client/.env file)
  // or default to http://localhost:5000/api if the env var is not set.
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tutorMatchToken'); // Get token from local storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Pass any request errors down the chain
  }
);

// Response interceptor for handling common API responses, especially token expiration
api.interceptors.response.use(
  (response) => {
    return response; // If response is successful, just return it
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if the error is 401 (Unauthorized) and it's not a retry
    // This typically means the access token has expired or is invalid
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried
      
      try {
        const refreshToken = localStorage.getItem('tutorMatchRefreshToken'); // Get refresh token
        if (refreshToken) {
          // Attempt to get a new access token using the refresh token
          // The endpoint for refresh token should be relative to your baseURL
          // (e.g., if baseURL is /api, this hits /api/auth/refresh-token)
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {
            refreshToken
          });
          
          const { token } = response.data; // Extract new access token
          localStorage.setItem('tutorMatchToken', token); // Store new access token
          
          originalRequest.headers['Authorization'] = `Bearer ${token}`; // Update header for original request
          return api(originalRequest); // Retry the original failed request with the new token
        }
      } catch (refreshError) {
        // If refresh token request itself fails (e.g., refresh token expired/invalid)
        console.error("Token refresh failed:", refreshError);
        // Clear all tokens and redirect to login page
        localStorage.removeItem('tutorMatchToken');
        localStorage.removeItem('tutorMatchRefreshToken');
        window.location.href = '/login'; // Redirect to login page
        return Promise.reject(refreshError); // Propagate the refresh error
      }
    }
    
    return Promise.reject(error); // For any other errors, propagate them
  }
);

// Auth API endpoints (these will call your backend's /api/auth routes)
const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('tutorMatchToken'); // Clear tokens on logout
    localStorage.removeItem('tutorMatchRefreshToken');
  },
  getCurrentUser: () => api.get('/auth/me'), // Example: get current user's profile
  updateProfile: (userData) => api.put('/auth/profile', userData), // Example: update user profile
};

// Tutors API endpoints (these will call your backend's /api/tutors routes)
const tutors = {
  getAll: (params) => api.get('/tutors', { params }), // Get all tutors, possibly with query parameters
  getById: (id) => api.get(`/tutors/${id}`), // Get a single tutor by ID
  becomeTutor: (tutorData) => api.post('/tutors/apply', tutorData), // Apply to be a tutor
  updateTutor: (tutorData) => api.put(`/tutors/${tutorData.id}`, tutorData), // Update tutor profile
  updateAvailability: (tutorId, availabilities) => api.put(`/tutors/${tutorId}/availabilities`, { availabilities }), // Update tutor's availability
  getAvailabilities: (tutorId) => api.get(`/tutors/${tutorId}/availabilities`), // Get tutor's availability
  deleteAvailability: (tutorId, availabilityId) => api.delete(`/tutors/${tutorId}/availabilities/${availabilityId}`), // Delete a specific availability slot
  addAvailability: (tutorId, availability) => api.post(`/tutors/${tutorId}/availabilities`, availability), // Add a new availability slot
  getRatings: (tutorId) => api.get(`/tutors/${tutorId}/ratings`), // Get ratings for a tutor
};

// Students API endpoints (these will call your backend's /api/students routes)
const students = {
  getDashboard: () => api.get('/students/dashboard'), // Get student dashboard data
  getBookings: () => api.get('/students/bookings'), // Get student's bookings
};

// Bookings API endpoints (these will call your backend's /api/bookings routes)
const bookings = {
  create: (bookingData) => api.post('/bookings', bookingData), // Create a new booking
  getAll: (params) => api.get('/bookings', { params }), // Get all bookings, possibly with query parameters
  getById: (id) => api.get(`/bookings/${id}`), // Get a single booking by ID
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData), // Update a booking
  cancel: (id) => api.delete(`/bookings/${id}`), // Cancel a booking
  addRating: (bookingId, ratingData) => api.post(`/bookings/${bookingId}/ratings`, ratingData), // Add a rating to a booking
};

// Messages API endpoints (these will call your backend's /api/messages routes)
const messages = {
  getConversations: () => api.get('/messages/conversations'), // Get list of conversations
  getConversation: (userId) => api.get(`/messages/conversations/${userId}`), // Get messages in a specific conversation
  sendMessage: (receiverId, content) => api.post('/messages', { receiverId, content }), // Send a new message
};

// Search API endpoints (these will call your backend's /api/search routes)
const search = {
  tutors: (params) => api.get('/search/tutors', { params }), // Search for tutors
  subjects: (query) => api.get('/search/subjects', { params: { query } }), // Search for subjects
};

// Export the main Axios instance and all defined endpoint categories
export default {
  ...api, // Spreads all properties and methods of the base Axios instance
  auth,
  tutors,
  students,
  bookings,
  messages,
  search,
  // Explicitly export core Axios methods for direct use if preferred
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete
};