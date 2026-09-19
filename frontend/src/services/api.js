import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('postwise_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('postwise_token');
        localStorage.removeItem('postwise_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Brand Service
export const brandAPI = {
  getBrands: () => api.get('/brands'),
  getBrandById: (id) => api.get(`/brands/${id}`),
  createBrand: (data) => api.post('/brands', data),
  updateBrand: (id, data) => api.put(`/brands/${id}`, data),
  deleteBrand: (id) => api.delete(`/brands/${id}`),
};

// Calendar Service
export const calendarAPI = {
  generateCalendar: (data) => api.post('/calendars/generate', data),
  getCalendars: () => api.get('/calendars'),
  getCalendarById: (id) => api.get(`/calendars/${id}`),
  exportJSONUrl: (id) => `/api/calendars/${id}/export/json`,
  exportCSVUrl: (id) => `/api/calendars/${id}/export/csv`,
  exportJSON: (id) => api.get(`/calendars/${id}/export/json`, { responseType: 'blob' }),
  exportCSV: (id) => api.get(`/calendars/${id}/export/csv`, { responseType: 'blob' }),
  deleteCalendar: (id) => api.delete(`/calendars/${id}`),
};

// Post Service
export const postAPI = {
  createPost: (data) => api.post('/posts', data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  regeneratePost: (id, customInstruction) => api.post(`/posts/${id}/regenerate`, { customInstruction }),
  reschedulePost: (id, date, timeSlot) => api.patch(`/posts/${id}/reschedule`, { date, timeSlot }),
  deletePost: (id) => api.delete(`/posts/${id}`),
};

export default api;
