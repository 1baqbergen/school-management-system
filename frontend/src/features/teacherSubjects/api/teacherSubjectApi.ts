// src/features/teacherSubjects/api/teacherSubjectApi.ts
import apiClient from '../../../services/apiClient';
import type { TeacherSubject, CreateTeacherSubjectDto, TeacherOption, SubjectOption } from '../types/teacherSubject.types';

class TeacherSubjectApi {
  private readonly baseUrl = 'api/teacher-subjects';

  /**
   * Получить все назначения
   * GET /api/teacher-subjects
   */
  async getAll(): Promise<TeacherSubject[]> {
    try {
      const response = await apiClient.get<TeacherSubject[]>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher subjects:', error);
      throw error;
    }
  }

  /**
   * Создать новое назначение
   * POST /api/teacher-subjects
   */
  async create(data: CreateTeacherSubjectDto): Promise<TeacherSubject> {
    try {
      const response = await apiClient.post<TeacherSubject>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating teacher subject:', error);
      throw error;
    }
  }

  /**
   * Удалить назначение
   * DELETE /api/teacher-subjects/:id
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting teacher subject:', error);
      throw error;
    }
  }

  /**
   * Получить список учителей для селекта
   * GET /api/teachers
   */
  async getTeachers(): Promise<TeacherOption[]> {
  const response = await apiClient.get<{
    count: number;
    teachers: TeacherOption[];
  }>('/api/teachers');

  return response.data.teachers;
}

  /**
   * Получить список предметов для селекта
   * GET /api/subjects
   */
  async getSubjects(): Promise<SubjectOption[]> {
  const response = await apiClient.get<SubjectOption[]>('/api/subjects');
  return response.data;
}
}

export const teacherSubjectApi = new TeacherSubjectApi();