import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

// Recipe endpoints
export const recipeAPI = {
  getAll: (params) => api.get('/recipes', { params }),
  getFeatured: () => api.get('/recipes/featured'),
  getById: (id) => api.get(`/recipes/${id}`),
  create: (data) => api.post('/recipes', data),
  update: (id, data) => api.put(`/recipes/${id}`, data),
  delete: (id) => api.delete(`/recipes/${id}`)
};

// Comment endpoints
export const commentAPI = {
  getByRecipe: (recipeId) => api.get(`/comments/recipe/${recipeId}`),
  create: (recipeId, data) => api.post(`/comments/recipe/${recipeId}`, data),
  update: (commentId, data) => api.put(`/comments/${commentId}`, data),
  delete: (commentId) => api.delete(`/comments/${commentId}`)
};  