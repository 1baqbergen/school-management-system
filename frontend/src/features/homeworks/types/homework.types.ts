// src/features/homeworks/types/homework.types.ts
export interface Homework {
  id: number;
  title: string;
  description: string;
  class_id: number;
  class_name: string;
  subject_id: number;
  subject_name: string;
  teacher_id: number;
  teacher_name: string;
  due_date: string;
  created_at: string;
}

export interface CreateHomeworkDto {
  title: string;
  description: string;
  class_id: number;
  subject_id: number;
  due_date: string;
}

export interface Submission {
  id: number;
  homework_id: number;
  student_id: number;
  student_name: string;
  content: string;
  file_url: string | null;
  grade: number | null;
  comment: string | null;
  submitted_at: string;
  subject_id: number; 
  teacher_id: number; 
  grade_comment?: string;
}

export interface CreateSubmissionDto {
  homework_id: number;
  content: string;
  file_url?: string | null;
}

export interface GradeSubmissionDto {
  grade: number;
  comment: string;
  subject_id: number;
  teacher_id: number; 
}

export const generateDefaultComment = (grade: number): string => {
  if (grade >= 9 && grade <= 10) return "Өте жақсы жұмыс";
  if (grade >= 7 && grade <= 8) return "Жақсы жұмыс";
  if (grade >= 5 && grade <= 6) return "Орташа";
  return "Көбірек дайындалу керек";
};

export const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date();
};