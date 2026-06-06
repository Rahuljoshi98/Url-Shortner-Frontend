import axios from 'axios';
import apiRoutes from './apiRoutes';

// Axios instance – baseURL is NOT set here; each call uses the full URL from apiRoutes
const api = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────
export const registerUser = (data)          => api.post(apiRoutes.auth.register, data);
export const loginUser    = (data)          => api.post(apiRoutes.auth.login, data);
export const logoutUser   = ()              => api.post(apiRoutes.auth.logout);

// ── URLs ──────────────────────────────────────────────────────────
export const createShortUrl = (data)        => api.post(apiRoutes.url.create, data);
export const getAllUrls      = ()            => api.get(apiRoutes.url.getAll);
export const getUrlByCode    = (shortCode)  => api.get(apiRoutes.url.getByCode + shortCode);
export const getUrlDetails   = (id)         => api.get(apiRoutes.url.getById + id);
export const deleteUrl       = (id)         => api.delete(apiRoutes.url.delete + id);
export const updateUrl       = (id, data)   => api.patch(apiRoutes.url.update + id, data);

export default api;
