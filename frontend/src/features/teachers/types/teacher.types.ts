// src/features/teachers/types/teacher.types.ts

// Основной интерфейс учителя (то что приходит с бекенда)
export interface Teacher {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  hire_date: string; // YYYY-MM-DD
  is_active: boolean;
  created_at: string; // ISO date
}

// Интерфейс для создания учителя
export interface CreateTeacherDto {
  full_name: string;
  email: string;
  password: string;
  hire_date: string;
}

// Интерфейс для обновления учителя
export interface UpdateTeacherDto {
  full_name?: string;
  email?: string;
  hire_date?: string;
  is_active?: boolean;
  password?: string; // опционально, только если нужно сменить пароль
}

// Статусы для отображения
export const TEACHER_STATUS = {
  active: 'Белсенді',
  inactive: 'Белсенді емес',
} as const;