// src/store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useParentStore } from '../features/parent/store/parentStore';

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string | number;
  name?: string;
  full_name?: string;
  email?: string;
  role: UserRole | string;

  parent_id?: number;
  teacher_subjects_ids?: number[];

  teacher_id?: number | null;
  student_id?: number | null;
  class_id?: number | null;

  avatar?: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const userStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      error: null,

      setUser: (user) =>
        set({
          user,
          error: null,
        }),

      logout: () => {
        localStorage.removeItem('token');

        try {
          useParentStore.getState().reset();
        } catch (e) {
          console.warn('ParentStore reset error:', e);
        }

        set({
          user: null,
          error: null,
          isLoading: false,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),
    }),
    {
      name: 'user-storage',

      // ❗ ТЕК user сақтау (дұрыс)
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
export const useUser = () => userStore((state) => state.user);

export const useUserRole = () => userStore((state) => state.user?.role);

export const useIsAuthenticated = () => {
  const user = userStore((state) => state.user);
  return !!user;
};

export const useAuthLoading = () => {
  return userStore((state) => state.isLoading);
};

export const isAdmin = (user: User | null) => user?.role === 'admin';
export const isTeacher = (user: User | null) => user?.role === 'teacher';
export const isStudent = (user: User | null) => user?.role === 'student';
export const isParent = (user: User | null) => user?.role === 'parent';