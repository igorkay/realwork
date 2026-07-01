import axios from 'axios';

const api = axios.create({
  baseURL: '/api/', // Изменили здесь
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