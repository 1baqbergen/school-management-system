// src/features/students/api/studentApi.ts

import apiClient from '../../../services/apiClient';
import type { Student, CreateStudentDto, UpdateStudentDto, StudentOption } from '../types/student.types';
class StudentApi {
  private readonly baseUrl = 'api/students';
  async getAll(): Promise<Student[]> {
    try {
      const response = await apiClient.get<Student[]>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }
  async getList(): Promise<StudentOption[]> {
    try {
      const response = await apiClient.get<StudentOption[]>(`${this.baseUrl}/list`);
      return response.data;
    } catch (error) {
      console.error('Error fetching students list:', error);
      throw error;
    }
  }
  async create(data: CreateStudentDto): Promise<Student> {
    try {
      const response = await apiClient.post<Student>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  /**
   * Обновить ученика
   * PUT /api/students/:id
   */
  async update(id: number, data: UpdateStudentDto): Promise<Student> {
    try {
      const response = await apiClient.put<Student>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  /**
   * Удалить ученика
   * DELETE /api/students/:id
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }
}

export const studentApi = new StudentApi();