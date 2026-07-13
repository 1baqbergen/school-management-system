// src/features/subjects/types/subject.types.ts
export interface Subject {
  id: number;
  name: string;
  created_at?: string; // ISO date string
}
export interface CreateSubjectDto {
  name: string;
}
export interface UpdateSubjectDto {
  name: string;
}