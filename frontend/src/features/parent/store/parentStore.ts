// src/features/parent/store/parentStore.ts
import { create } from 'zustand';
import type { ParentState, Child } from '../types/parent.types';
import { parentApi } from '../api/parentApi';

interface ParentStore extends ParentState {
  fetchParents: () => Promise<void>;
  fetchChildren: () => Promise<void>;
  fetchChildGrades: (studentId: number) => Promise<void>;
  fetchChildSchedule: (studentId: number) => Promise<void>;
  setSelectedChild: (child: Child | null) => void;
  addParent: (data: any) => Promise<void>;
  deleteParent: (id: number) => Promise<void>;
  assignStudent: (parentId: number, studentId: number) => Promise<void>;
  clearError: () => void;
  reset: () => void; // 🔥 ЖАҢА - state тазалау
}

export const useParentStore = create<ParentStore>((set, get) => ({
  parents: [],
  children: [],
  selectedChild: null,
  grades: [],
  schedule: [],
  loading: false,
  error: null,

  fetchParents: async () => {
    set({ loading: true, error: null });
    try {
      const parents = await parentApi.getAllParents();
      set({ parents, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchChildren: async () => {
    set({ loading: true, error: null });
    try {
      const children = await parentApi.getMyChildren();
      set({ children, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchChildGrades: async (studentId: number) => {
    set({ loading: true, error: null });
    try {
      const grades = await parentApi.getChildGrades(studentId);
      set({ grades, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchChildSchedule: async (studentId: number) => {
    set({ loading: true, error: null });
    try {
      const schedule = await parentApi.getChildSchedule(studentId);
      set({ schedule, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  setSelectedChild: (child) => {
    set({ selectedChild: child });
  },

  addParent: async (data) => {
    set({ loading: true, error: null });
    try {
      await parentApi.createParent(data);
      await get().fetchParents();
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteParent: async (id) => {
    set({ loading: true, error: null });
    try {
      await parentApi.deleteParent(id);
      await get().fetchParents();
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  assignStudent: async (parentId, studentId) => {
    set({ loading: true, error: null });
    try {
      await parentApi.assignStudent(parentId, studentId);
      await get().fetchParents();
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  // 🔥 RESET функциясы - барлық state-ті тазалайды
  reset: () => set({
    parents: [],
    children: [],
    selectedChild: null,
    grades: [],
    schedule: [],
    loading: false,
    error: null,
  }),
}));