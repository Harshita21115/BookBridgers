import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Books API
export const booksAPI = {
  getAll: (filters = {}) => api.get('/books', { params: filters }),
  getById: (id) => api.get(`/books/${id}`),
  create: (bookData) => api.post('/books', bookData),
  update: (id, bookData) => api.put(`/books/${id}`, bookData),
  delete: (id) => api.delete(`/books/${id}`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

// Requests API
export const requestsAPI = {
  getAll: () => api.get('/requests'),
  getByUser: (userId) => api.get(`/requests/user/${userId}`),
  create: (requestData) => api.post('/requests', requestData),
  updateStatus: (id, status, approvedBy) => api.put(`/requests/${id}/status`, { status, approvedBy }),
  returnBook: (id) => api.put(`/requests/${id}/return`),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getPendingRequests: () => api.get('/admin/pending-requests'),
  getBooks: () => api.get('/admin/books'),
  getUsers: () => api.get('/admin/users'),
  updateRequest: (id, status, approvedBy) => api.put(`/admin/requests/${id}`, { status, approvedBy }),
};

// Partner Libraries API
export const partnerLibrariesAPI = {
  getAll: (filters = {}) => api.get('/partner-libraries', { params: filters }),
  getById: (id) => api.get(`/partner-libraries/${id}`),
  create: (libraryData) => api.post('/partner-libraries', libraryData),
  update: (id, libraryData) => api.put(`/partner-libraries/${id}`, libraryData),
  delete: (id) => api.delete(`/partner-libraries/${id}`),
  findNearest: (latitude, longitude, maxDistance = 50, limit = 10) => 
    api.get('/partner-libraries/nearest', { 
      params: { latitude, longitude, maxDistance, limit } 
    }),
  getUserNearby: (maxDistance = 25, limit = 10) => 
    api.get('/partner-libraries/user/nearby', { 
      params: { maxDistance, limit } 
    }),
};

// Appointments API
export const appointmentsAPI = {
  create: (appointmentData) => api.post('/appointments', appointmentData),
  getMyAppointments: () => api.get('/appointments/my-appointments'),
  getLibraryAppointments: (libraryId, filters = {}) => 
    api.get(`/appointments/library/${libraryId}`, { params: filters }),
  getAvailableTimeSlots: (libraryId, date) => 
    api.get(`/appointments/library/${libraryId}/available-slots`, { 
      params: { date } 
    }),
  updateStatus: (id, status, notes) => 
    api.put(`/appointments/${id}/status`, { status, notes }),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
};

export default api;



