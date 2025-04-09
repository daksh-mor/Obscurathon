import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat API for RAG functionality
const chatApi = axios.create({
  baseURL: import.meta.env.VITE_CHAT_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor to main API
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
      }
    }
    return Promise.reject(error);
  }
);

// Existing PYQ service
const pyqService = {
  uploadPYQ: (formData, onUploadProgress) => {
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  getPYQs: (filters = {}) => {
    return api.get('/pyqs', { params: filters });
  },

  getPYQById: (id) => {
    return api.get(`/pyqs/${id}`);
  },

  downloadPYQ: (id) => {
    return api.get(`/pyqs/${id}/download`, {
      responseType: 'blob',
    });
  },

  searchPYQs: (query) => {
    return api.get('/pyqs/search', { params: { q: query } });
  },

  getFilterOptions: () => {
    return api.get('/filter-options');
  },

  // New RAG chat functions
  sendChatQuery: async (messages) => {
    try {
      const response = await chatApi.post('/chat', {
        messages: messages
      });
      return response.data;
    } catch (error) {
      console.error('Error sending chat query:', error);
      throw error;
    }
  },
  
  triggerScan: async () => {
    try {
      const response = await chatApi.post('/scan');
      return response.data;
    } catch (error) {
      console.error('Error triggering scan:', error);
      throw error;
    }
  },
  
  getSystemStatus: async () => {
    try {
      const response = await chatApi.get('/status');
      return response.data;
    } catch (error) {
      console.error('Error getting system status:', error);
      throw error;
    }
  }
};

const authService = {
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  logout: () => {
    localStorage.removeItem('authToken');
    return Promise.resolve();
  },

  checkAuth: () => {
    return api.get('/auth/me');
  },
};

export { api, chatApi, pyqService, authService };