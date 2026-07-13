// src/features/classes/types/class.types.ts

/**
 * Интерфейс класса (то что приходит с бекенда)
 */
export interface Class {
  id: number;
  name: string; // полное название (например "10А")
  grade: number; // цифра класса (1-11)
  letter: string; // буква класса (А, Б, В и т.д.)
  class_teacher_id?: number | null;
  class_teacher?: string | null; // ФИО учителя
  students_count: number;
}

/**
 * DTO для создания класса
 */
export interface CreateClassDto {
  grade: number;
  letter: string;
  class_teacher_id?: number | null;
}

/**
 * DTO для обновления класса
 */
export interface UpdateClassDto extends CreateClassDto {}

/**
 * Интерфейс для учителя (используется в select)
 */
export interface TeacherOption {
  id: number;
  full_name: string;
}

/**
 * Константы для валидации
 */
export const GRADE_MIN = 1;
export const GRADE_MAX = 11;
export const LETTER_LENGTH = 1;