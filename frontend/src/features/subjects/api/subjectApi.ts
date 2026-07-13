// src/features/subjects/api/subjectApi.ts
import apiClient from '../../../services/apiClient';
import type { Subject, CreateSubjectDto, UpdateSubjectDto } from '../types/subject.types';

class SubjectApi {
  private readonly baseUrl = '/api/subjects';

  /**
   * Получить все предметы
   * GET /api/subjects
   */
  async getAll(): Promise<Subject[]> {
    try {
      const response = await apiClient.get<Subject[]>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
  }

  /**
   * Создать новый предмет
   * POST /api/subjects
   */
  async create(data: CreateSubjectDto): Promise<Subject> {
    try {
      const response = await apiClient.post<Subject>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating subject:', error);
      throw error;
    }
  }

  /**
   * Обновить предмет
   * PUT /api/subjects/:id
   */
  async update(id: number, data: UpdateSubjectDto): Promise<Subject> {
    try {
      const response = await apiClient.put<Subject>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  }

  /**
   * Удалить предмет
   * DELETE /api/subjects/:id
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  }
}

export const subjectApi = new SubjectApi();