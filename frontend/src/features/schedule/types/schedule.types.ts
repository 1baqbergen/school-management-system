export interface Schedule {
  id: number;

  class_id: number;
  teacher_id: number;
  subject_id: number;

  class_name?: string;
  teacher_name?: string;
  subject_name?: string;

  // backend SELECT-те бар:
  teacher_user_id?: number;

  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  lesson_number: number;
  start_time: string;
  end_time: string;
}

export interface CreateScheduleDto {
  class_id: number;
  teacher_id: number;
  subject_id: number;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  lesson_number: number;
  start_time: string;
  end_time: string;
}

export const DAYS_OF_WEEK = ['Monday','Tuesday','Wednesday','Thursday','Friday'] as const;

export const DAY_DISPLAY_NAMES: Record<string, string> = {
  Monday: 'Дүйсенбі',
  Tuesday: 'Сейсенбі',
  Wednesday: 'Сәрсенбі',
  Thursday: 'Бейсенбі',
  Friday: 'Жұма',
};

export interface ScheduleMeta {
  classes: { id: number; name: string }[];
  teachers: { id: number; full_name: string }[];
  subjects: { id: number; name: string }[];
}