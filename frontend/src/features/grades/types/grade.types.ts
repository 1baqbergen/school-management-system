// src/features/grades/types/grade.types.ts
// Основной интерфейс оценки (то что приходит с бекенда)
export interface Grade {
  id: number;
  student_id: number;
  student_name: string;
  class_id: number;
  class_name: string;
  subject_id: number;
  subject_name: string;
  teacher_id: number;
  teacher_name: string;
  grade_value: number;
  grade_date: string; // YYYY-MM-DD
  comment: string | null;
}

// Интерфейс для создания/редактирования оценки
export interface CreateGradeDto {
  student_id: number;
  subject_id: number;
  grade_value: number;
  grade_date: string;
  comment: string;
  teacher_id?: number; // ✅ admin/director үшін керек, teacher үшін жібермейміз
}

export interface GradeMeta {
  students: Array<{ id: number; name: string; class_name: string; class_id: number}>;
  subjects: Array<{ id: number; name: string }>;
  teachers?: Array<{ id: number; name: string }>; // ✅ admin үшін
}

// Интерфейс для обновления оценки
export interface UpdateGradeDto extends Partial<CreateGradeDto> {
  id: number;
}

// Функция для генерации комментария по умолчанию
export const generateDefaultComment = (grade: number): string => {
  if (grade >= 9 && grade <= 10) return "Өте жақсы жұмыс";
  if (grade >= 7 && grade <= 8) return "Жақсы жұмыс";
  if (grade >= 5 && grade <= 6) return "Орташа";
  if (grade >= 0 && grade <= 4) return "Көбірек дайындалу керек";
  return "";
};

// Константы
export const GRADE_VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];