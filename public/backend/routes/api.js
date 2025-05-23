import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tutorMatchToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration and refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('tutorMatchRefreshToken');
        if (refreshToken) {
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {
            refreshToken
          });
          
          const { token } = response.data;
          localStorage.setItem('tutorMatchToken', token);
          
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('tutorMatchToken');
        localStorage.removeItem('tutorMatchRefreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API endpoints
const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('tutorMatchToken');
    localStorage.removeItem('tutorMatchRefreshToken');
  },
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Tutors API endpoints
const tutors = {
  getAll: (params) => api.get('/tutors', { params }),
  getById: (id) => api.get(`/tutors/${id}`),
  becomeTutor: (tutorData) => api.post('/tutors/apply', tutorData),
  updateTutor: (tutorData) => api.put(`/tutors/${tutorData.id}`, tutorData),
  updateAvailability: (tutorId, availabilities) => api.put(`/tutors/${tutorId}/availabilities`, { availabilities }),
  getAvailabilities: (tutorId) => api.get(`/tutors/${tutorId}/availabilities`),
  deleteAvailability: (tutorId, availabilityId) => api.delete(`/tutors/${tutorId}/availabilities/${availabilityId}`),
  addAvailability: (tutorId, availability) => api.post(`/tutors/${tutorId}/availabilities`, availability),
  getRatings: (tutorId) => api.get(`/tutors/${tutorId}/ratings`),
};

// Students API endpoints
const students = {
  getDashboard: () => api.get('/students/dashboard'),
  getBookings: () => api.get('/students/bookings'),
};

// Bookings API endpoints
const bookings = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  cancel: (id) => api.delete(`/bookings/${id}`),
  addRating: (bookingId, ratingData) => api.post(`/bookings/${bookingId}/ratings`, ratingData),
};

// Messages API endpoints
const messages = {
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (userId) => api.get(`/messages/conversations/${userId}`),
  sendMessage: (receiverId, content) => api.post('/messages', { receiverId, content }),
};

// Search API endpoints
const search = {
  tutors: (params) => api.get('/search/tutors', { params }),
  subjects: (query) => api.get('/search/subjects', { params: { query } }),
};

// Export API with all endpoints
export default {
  ...api,
  auth,
  tutors,
  students,
  bookings,
  messages,
  search,
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete
};