// src/services/apiClient.ts
import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { userStore } from '../store/userStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const language = localStorage.getItem('language') || 'ru';
    config.headers['Accept-Language'] = language;
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
  console.log('Получена ошибка 401 - пользователь не авторизован');

  localStorage.removeItem('token');

  userStore.getState().logout();

  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
  return Promise.reject(error);
}

    if (error.response?.status === 403) {
      console.log('Получена ошибка 403 - доступ запрещен');
  
      const forbiddenError = {
        ...error,
        isForbidden: true,
        message: 'У вас нет прав для выполнения этого действия'
      };
      return Promise.reject(forbiddenError);
    }

    if (error.response?.status === 500) {
      console.error('Ошибка сервера:', error);
      const serverError = {
        ...error,
        isServerError: true,
        message: 'Произошла внутренняя ошибка сервера. Пожалуйста, попробуйте позже.'
      };
      return Promise.reject(serverError);
    }
    
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('Сетевая ошибка:', error);
      const networkError = {
        ...error,
        isNetworkError: true,
        message: 'Не удалось связаться с сервером. Проверьте подключение к интернету.'
      };
      return Promise.reject(networkError);
    }
    return Promise.reject(error);
  }
);

export default apiClient;