import axios from 'axios';
import { 
  DEFAULT_USER, 
  INITIAL_BRANDS, 
  INITIAL_CALENDAR, 
  INITIAL_POSTS, 
  generate30DayPosts, 
  regenerateMockPost 
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
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

// Response interceptor
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

// Local Storage Initializer for Standalone Demo Mode
const initStorage = () => {
  if (!localStorage.getItem('postwise_brands')) {
    localStorage.setItem('postwise_brands', JSON.stringify(INITIAL_BRANDS));
  }
  if (!localStorage.getItem('postwise_calendars')) {
    localStorage.setItem('postwise_calendars', JSON.stringify([INITIAL_CALENDAR]));
  }
  if (!localStorage.getItem('postwise_posts')) {
    localStorage.setItem('postwise_posts', JSON.stringify(INITIAL_POSTS));
  }
};

initStorage();

// Storage helper functions
const getStored = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStored = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('Storage set failed', e);
  }
};

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  register: async (data) => {
    try {
      const res = await api.post('/auth/register', data);
      return res.data;
    } catch (err) {
      // Mock fallback for demo
      const user = { _id: 'usr_' + Date.now(), name: data.name, email: data.email, role: 'Creator' };
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('postwise_token', token);
      localStorage.setItem('postwise_user', JSON.stringify(user));
      return { success: true, token, user };
    }
  },
  login: async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      return res.data;
    } catch (err) {
      // Mock fallback for demo
      const user = DEFAULT_USER;
      const token = 'mock_jwt_token_alex_demo';
      localStorage.setItem('postwise_token', token);
      localStorage.setItem('postwise_user', JSON.stringify(user));
      return { success: true, token, user };
    }
  },
  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (err) {
      const stored = getStored('postwise_user', DEFAULT_USER);
      return { user: stored };
    }
  },
};

// ============================================
// BRAND API
// ============================================
export const brandAPI = {
  getBrands: async () => {
    try {
      const res = await api.get('/brands');
      return res.data;
    } catch (err) {
      return getStored('postwise_brands', INITIAL_BRANDS);
    }
  },
  getBrandById: async (id) => {
    try {
      const res = await api.get(`/brands/${id}`);
      return res.data;
    } catch (err) {
      const brands = getStored('postwise_brands', INITIAL_BRANDS);
      return brands.find((b) => b._id === id) || brands[0];
    }
  },
  createBrand: async (data) => {
    try {
      const res = await api.post('/brands', data);
      return res.data;
    } catch (err) {
      const brands = getStored('postwise_brands', INITIAL_BRANDS);
      const newBrand = {
        _id: 'brand_' + Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      const updated = [newBrand, ...brands];
      setStored('postwise_brands', updated);
      return newBrand;
    }
  },
  updateBrand: async (id, data) => {
    try {
      const res = await api.put(`/brands/${id}`, data);
      return res.data;
    } catch (err) {
      const brands = getStored('postwise_brands', INITIAL_BRANDS);
      const updated = brands.map((b) => (b._id === id ? { ...b, ...data } : b));
      setStored('postwise_brands', updated);
      return updated.find((b) => b._id === id);
    }
  },
  deleteBrand: async (id) => {
    try {
      const res = await api.delete(`/brands/${id}`);
      return res.data;
    } catch (err) {
      const brands = getStored('postwise_brands', INITIAL_BRANDS);
      const updated = brands.filter((b) => b._id !== id);
      setStored('postwise_brands', updated);
      return { success: true };
    }
  },
};

// ============================================
// CALENDAR API
// ============================================
export const calendarAPI = {
  generateCalendar: async (data) => {
    try {
      const res = await api.post('/calendars/generate', data);
      return res.data;
    } catch (err) {
      // Simulate realistic AI generation
      const calId = 'cal_' + Date.now();
      const newCal = {
        _id: calId,
        user: DEFAULT_USER._id,
        brand: data.brandId || 'brand_ecoglow_1',
        month: data.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        topic: data.topic || 'AI Content Strategy Campaign',
        targetPlatforms: data.platforms || ['Instagram', 'LinkedIn', 'X/Twitter'],
        postCount: 30,
        createdAt: new Date().toISOString(),
      };

      const newPosts = generate30DayPosts(newCal.brand, calId, data.month);

      // Save to localStorage
      const cals = getStored('postwise_calendars', []);
      setStored('postwise_calendars', [newCal, ...cals]);

      const allPosts = getStored('postwise_posts', []);
      setStored('postwise_posts', [...newPosts, ...allPosts]);

      return { calendar: newCal, posts: newPosts };
    }
  },
  getCalendars: async () => {
    try {
      const res = await api.get('/calendars');
      return res.data;
    } catch (err) {
      return getStored('postwise_calendars', [INITIAL_CALENDAR]);
    }
  },
  getCalendarById: async (id) => {
    try {
      const res = await api.get(`/calendars/${id}`);
      return res.data;
    } catch (err) {
      const cals = getStored('postwise_calendars', [INITIAL_CALENDAR]);
      const posts = getStored('postwise_posts', INITIAL_POSTS);
      const cal = cals.find((c) => c._id === id) || cals[0];
      const calPosts = posts.filter((p) => p.calendar === cal._id || p.calendar === id);
      return { calendar: cal, posts: calPosts.length ? calPosts : posts };
    }
  },
  deleteCalendar: async (id) => {
    try {
      const res = await api.delete(`/calendars/${id}`);
      return res.data;
    } catch (err) {
      const cals = getStored('postwise_calendars', []);
      setStored('postwise_calendars', cals.filter((c) => c._id !== id));
      const posts = getStored('postwise_posts', []);
      setStored('postwise_posts', posts.filter((p) => p.calendar !== id));
      return { success: true };
    }
  },
};

// ============================================
// POST API
// ============================================
export const postAPI = {
  createPost: async (data) => {
    try {
      const res = await api.post('/posts', data);
      return res.data;
    } catch (err) {
      const posts = getStored('postwise_posts', INITIAL_POSTS);
      const newPost = {
        _id: 'post_' + Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setStored('postwise_posts', [newPost, ...posts]);
      return newPost;
    }
  },
  updatePost: async (id, data) => {
    try {
      const res = await api.put(`/posts/${id}`, data);
      return res.data;
    } catch (err) {
      const posts = getStored('postwise_posts', INITIAL_POSTS);
      const updated = posts.map((p) => (p._id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p));
      setStored('postwise_posts', updated);
      return updated.find((p) => p._id === id);
    }
  },
  regeneratePost: async (id, customInstruction) => {
    try {
      const res = await api.post(`/posts/${id}/regenerate`, { customInstruction });
      return res.data;
    } catch (err) {
      const posts = getStored('postwise_posts', INITIAL_POSTS);
      const target = posts.find((p) => p._id === id);
      if (!target) throw new Error('Post not found');
      const regenerated = regenerateMockPost(target, customInstruction);
      const updated = posts.map((p) => (p._id === id ? regenerated : p));
      setStored('postwise_posts', updated);
      return regenerated;
    }
  },
  reschedulePost: async (id, date, timeSlot) => {
    try {
      const res = await api.patch(`/posts/${id}/reschedule`, { date, timeSlot });
      return res.data;
    } catch (err) {
      const posts = getStored('postwise_posts', INITIAL_POSTS);
      const updated = posts.map((p) =>
        p._id === id
          ? {
              ...p,
              date,
              timeSlot: timeSlot || p.timeSlot,
              updatedAt: new Date().toISOString(),
            }
          : p
      );
      setStored('postwise_posts', updated);
      return updated.find((p) => p._id === id);
    }
  },
  deletePost: async (id) => {
    try {
      const res = await api.delete(`/posts/${id}`);
      return res.data;
    } catch (err) {
      const posts = getStored('postwise_posts', INITIAL_POSTS);
      setStored('postwise_posts', posts.filter((p) => p._id !== id));
      return { success: true };
    }
  },
};

export default api;
