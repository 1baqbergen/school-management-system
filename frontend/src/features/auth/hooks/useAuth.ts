// src/features/auth/hooks/useAuth.ts
import { useCallback } from 'react';
import { userStore } from '../../../store/userStore';
import { authApi } from '../api/authApi';

export const useAuth = () => {
  const setUser = userStore((state) => state.setUser);
  const setLoading = userStore((state) => state.setLoading);
  const isLoading = userStore((state) => state.isLoading);

  const checkAuth = useCallback(async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setUser(null);
        return;
      }

      // getMe() -> Promise<User | null>
      const user = await authApi.getMe();

      if (!user) {
        localStorage.removeItem('token');
        setUser(null);
        return;
      }

      setUser(user);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  return { checkAuth, isLoading };
};
