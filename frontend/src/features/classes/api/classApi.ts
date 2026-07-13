
// src/features/classes/api/classApi.ts
import apiClient from '../../../services/apiClient';
import type { Class, CreateClassDto, UpdateClassDto, TeacherOption } from '../types/class.types';

// Студент пен баға үшін типтер
export interface StudentGrade {
  subject_name: string;
  grade_value: number;
  grade_date: string;
  comment?: string;
}

export interface ClassStudent {
  id: number;
  full_name: string;
  grades: StudentGrade[];
}

class ClassApi {
  private readonly baseUrl = '/api/classes';

  /**
   * Получить все классы
   * GET /api/classes
   */
  async getAll(): Promise<Class[]> {
    try {
      const response = await apiClient.get<Class[]>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  }

  /**
   * Получить список учителей для селекта
   * GET /api/teachers/list
   */
  async getTeachers(): Promise<TeacherOption[]> {
    try {
      const response = await apiClient.get<TeacherOption[]>('/api/teachers/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
  }

  /**
   * Получить класс учителя (для teacher роли)
   * GET /api/classes/teacher/my-class
   */
  async getTeacherClasses(): Promise<Class[]> {
    try {
      const response = await apiClient.get<Class[]>('/api/classes/teacher/my-class');
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher classes:', error);
      throw error;
    }
  }

  /**
   * Создать новый класс
   * POST /api/classes
   */
  async create(data: CreateClassDto): Promise<Class> {
    try {
      const response = await apiClient.post<Class>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  }

  /**
   * Обновить класс
   * PUT /api/classes/:id
   */
  async update(id: number, data: UpdateClassDto): Promise<Class> {
    try {
      const response = await apiClient.put<Class>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  }

  /**
   * Удалить класс
   * DELETE /api/classes/:id
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  }

  /**
   * Получить класс по id
   * GET /api/classes/:id
   */
  async getById(id: number): Promise<Class> {
    try {
      const response = await apiClient.get<Class>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching class with id=${id}:`, error);
      throw error;
    }
  }

  /**
   * Получить студентов класса с оценками
   * GET /api/classes/:id/students?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
   */
  async getClassStudents(classId: number, startDate?: string, endDate?: string): Promise<ClassStudent[]> {
    try {
      const response = await apiClient.get<ClassStudent[]>(`${this.baseUrl}/${classId}/students`, {
        params: { 
          start_date: startDate, 
          end_date: endDate 
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching students for class ${classId}:`, error);
      throw error;
    }
  }
}

export const classApi = new ClassApi();