import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

api.interceptors.request.use((config) => {
  // Забираем токен напрямую по ключу 'token'
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("Токен отсутствует в localStorage под ключом 'token'!");
  }
  return config;
});

export default api;