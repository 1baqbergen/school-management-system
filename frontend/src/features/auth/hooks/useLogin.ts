// src/features/auth/hooks/useLogin.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import type { LoginCredentials } from '../api/authApi';
import { userStore } from '../../../store/userStore';

interface UseLoginReturn {
  login: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Хук для обработки входа в систему
 */
export const useLogin = (): UseLoginReturn => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Получаем методы из стора
  const setUser = userStore((state) => state.setUser);
  const setLoading = userStore((state) => state.setLoading);

  const login = async (credentials: LoginCredentials) => {
    // Валидация на клиенте
    if (!credentials.email || !credentials.password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);
    setLoading(true);
    setError(null);

    try {
      // Шаг 1: Отправляем запрос на логин
      const loginResponse = await authApi.login(credentials);
      console.log('Логин успешен:', loginResponse.message);
      
      // Шаг 2: Получаем данные пользователя
      // Важно! После логина бекенд установил httpOnly cookie
      // Теперь мы можем запросить данные пользователя
      const userData = await authApi.getMe();
      
      if (userData) {
        // Шаг 3: Сохраняем пользователя в стор
        setUser(userData);
        
        // Шаг 4: Редирект в зависимости от роли
        switch (userData.role) {
          case 'admin':
            navigate('/admin', { replace: true });
            break;
          case 'teacher':
            navigate('/teacher', { replace: true });
            break;
          case 'student':
            navigate('/student', { replace: true });
            break;
          default:
            navigate('/dashboard', { replace: true });
        }
      } else {
        throw new Error('Не удалось получить данные пользователя');
      }
    } catch (err: any) {
      console.error('Ошибка входа:', err);
      
      // Обрабатываем разные типы ошибок
      if (err.response?.status === 401) {
        setError('Неверный email или пароль');
      } else if (err.isNetworkError) {
        setError('Ошибка соединения. Проверьте подключение к интернету');
      } else if (err.isServerError) {
        setError('Ошибка сервера. Попробуйте позже');
      } else {
        setError(err.message || 'Произошла ошибка при входе');
      }
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
};