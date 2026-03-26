import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/token/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  profile: () => api.get('/auth/profile/'),
};

export const productAPI = {
  list: (params) => api.get('/products/', { params }),
  detail: (id) => api.get(`/products/${id}/`),
  categories: () => api.get('/categories/'),
};

export const cartAPI = {
  get: () => api.get('/cart/'),
  add: (product_id, quantity = 1) => api.post('/cart/', { product_id, quantity }),
  updateItem: (item_id, quantity) => api.put(`/cart/items/${item_id}/`, { quantity }),
  removeItem: (item_id) => api.delete(`/cart/items/${item_id}/`),
  clear: () => api.delete('/cart/'),
};

export const orderAPI = {
  list: () => api.get('/orders/'),
  create: (shipping_address) => api.post('/orders/', { shipping_address }),
  detail: (id) => api.get(`/orders/${id}/`),
};

export default api;
