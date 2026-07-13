// src/features/grades/api/gradeApi.ts
import apiClient from '../../../services/apiClient';
import type { Grade, CreateGradeDto, GradeMeta } from '../types/grade.types';

class GradeApi {
  private readonly baseUrl = '/api/grades';

  /**
   * Получить все оценки (ADMIN)
   * GET /api/grades
   */
  async getAll(): Promise<Grade[]> {
    try {
      const response = await apiClient.get<Grade[]>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching grades:', error);
      throw error;
    }
  }

  /**
   * Получить оценки ученика (STUDENT)
   * GET /api/grades/student/:studentId
   */
  async getByStudentId(studentId: number): Promise<Grade[]> {
    try {
      const response = await apiClient.get<Grade[]>(`${this.baseUrl}/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student grades:', error);
      throw error;
    }
  }

  /**
   * Получить оценки учителя (TEACHER)
   * GET /api/grades/teacher/me
   */
  async getTeacherGrades(): Promise<Grade[]> {
    try {
      const response = await apiClient.get<Grade[]>(`${this.baseUrl}/teacher/me`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher grades:', error);
      throw error;
    }
  }

  /**
   * Создать оценку (ADMIN/TEACHER)
   * POST /api/grades
   */
  async create(data: CreateGradeDto): Promise<Grade> {
    try {
      const response = await apiClient.post<Grade>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating grade:', error);
      throw error;
    }
  }

  /**
   * Обновить оценку (ADMIN/TEACHER)
   * PUT /api/grades/:id
   */
  async update(id: number, data: Partial<CreateGradeDto>): Promise<Grade> {
    try {
      const response = await apiClient.put<Grade>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating grade:', error);
      throw error;
    }
  }

  /**
   * Удалить оценку (ADMIN)
   * DELETE /api/grades/:id
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting grade:', error);
      throw error;
    }
  }

  /**
   * Получить метаданные для модалки (студенты, предметы)
   * GET /api/grades/meta
   */
  async getMeta(): Promise<GradeMeta> {
    try {
      const response = await apiClient.get<GradeMeta>(`${this.baseUrl}/meta`);
      return response.data;
    } catch (error) {
      console.error('Error fetching grade meta:', error);
      throw error;
    }
  }
    /**
   * ADMIN: teacher таңдағанда пәндер
   * GET /api/grades/meta/teacher/:teacherId
   */
  async getSubjectsByTeacher(teacherId: number): Promise<{ subjects: Array<{ id: number; name: string }> }> {
    const response = await apiClient.get(`${this.baseUrl}/meta/teacher/${teacherId}`);
    return response.data;
  }
}



export const gradeApi = new GradeApi();