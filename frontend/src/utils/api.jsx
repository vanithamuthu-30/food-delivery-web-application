import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/profile'),
  updateProfile: (userData) => api.put('/profile', userData)
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`)
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (item) => api.post('/cart', item),
  updateItem: (id, data) => api.put(`/cart/${id}`, data),
  removeItem: (id) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart')
};

export const orderAPI = {
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
};

export const favoriteAPI = {
  getFavorites: () => api.get('/favorites'),
  addFavorite: (productId) => api.post('/favorites', { product_id: productId }),
  removeFavorite: (productId) => api.delete(`/favorites/${productId}`)
};

export const supportAPI = {
  getMessages: () => api.get('/support/messages'),
  sendMessage: (message) => api.post('/support/messages', { message })
};

export default api;
