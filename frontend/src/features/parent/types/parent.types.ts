// src/features/parent/types/parent.types.ts
export interface Parent {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateParentDto {
  full_name: string;
  email: string;
  password: string;
  phone: string;
}

export interface UpdateParentDto {
  full_name?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
}

export interface Child {
  id: number;
  student_id: number;
  full_name: string;
  class_name: string;
  avatar?: string;
}

export interface Grade {
  id: number;
  subject_name: string;
  grade_value: number;
  grade_date: string;
  teacher_name: string;
  comment: string | null;
  subject: string;
}

export interface Schedule {
  id: number;
  day_of_week: string;
  lesson_number: number;
  start_time: string;
  end_time: string;
  subject_name: string;
  teacher_name: string;
  class_name: string;
  subject: string;
}

export interface ParentState {
  parents: Parent[];
  children: Child[];
  selectedChild: Child | null;
  grades: Grade[];
  schedule: Schedule[];
  loading: boolean;
  error: string | null;
}