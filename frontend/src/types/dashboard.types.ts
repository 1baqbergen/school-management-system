// src/types/dashboard.types.ts

export interface DashboardStats {
  students: number;
  teachers: number;
  classes: number;
  avgGrade: number;
  totalGrades?: number;
}

export interface Student {
  id?: number;
  full_name: string;
  class: string;
  avg: number;
}

export interface GradeDatum {
  date: string;
  value: number;
}

export interface SubjectStat {
  subject: string;
  value: number;
}

export interface DashboardData {
  stats: DashboardStats;
  topStudents: Student[];
  weakStudents: Student[];
  gradeDynamics: GradeDatum[];
  subjectStats: SubjectStat[];
}

export type DashboardStatus = 'idle' | 'loading' | 'success' | 'error';