// src/features/students/types/student.types.ts


export interface Student {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  class_id: number;
  class_name: string;
  admission_year: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateStudentDto {
  full_name: string;
  email: string;
  password: string;
  class_id: number;
  admission_year: number;
}

/**
 * DTO для обновления ученика
 */
export interface UpdateStudentDto {
  full_name?: string;
  email?: string;
  class_id?: number;
  admission_year?: number;
  is_active?: boolean;
}

/**
 * Опция для селекта (классы, ученики)
 */
export interface StudentOption {
  id: number;
  full_name: string;
  class_name: string;
}

/**
 * Интерфейс для фильтрации
 */
export interface StudentFilters {
  class_id?: number | null;
  search?: string;
}

/**
 * Статусы для отображения
 */
export const STUDENT_STATUS = {
  active: 'Белсенді',
  inactive: 'Белсенді емес',
} as const;

/**
 * Константы для валидации
 */
export const ADMISSION_YEAR_MIN = 2000;
export const ADMISSION_YEAR_MAX = new Date().getFullYear() + 1;
export const PASSWORD_MIN_LENGTH = 6;