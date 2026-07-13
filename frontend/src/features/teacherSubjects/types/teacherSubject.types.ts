// src/features/teacherSubjects/types/teacherSubject.types.ts

/**
 * Интерфейс назначения предмета учителю (то что приходит с бекенда)
 */
export interface TeacherSubject {
  id: number;
  teacher_id: number;
  teacher_name: string;
  subject_id: number;
  subject_name: string;
  created_at?: string; // ISO date (если есть)
}

/**
 * DTO для создания назначения
 */
export interface CreateTeacherSubjectDto {
  teacher_id: number;
  subject_id: number;
}

/**
 * Интерфейс для опции учителя в селекте
 */
export interface TeacherOption {
  id: number;
  full_name: string;
  email?: string;
}

/**
 * Интерфейс для опции предмета в селекте
 */
export interface SubjectOption {
  id: number;
  name: string;
}