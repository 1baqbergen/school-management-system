// src/features/parent/api/parentApi.ts
import apiClient from '../../../services/apiClient';
import type { Parent, CreateParentDto, Child, Grade, Schedule } from '../types/parent.types';

class ParentApi {
  private readonly baseUrl = 'api/parents';

  // ADMIN endpoints
  async createParent(data: CreateParentDto): Promise<Parent> {
    const response = await apiClient.post<Parent>(this.baseUrl, data);
    return response.data;
  }

  async getAllParents(): Promise<Parent[]> {
    const response = await apiClient.get<Parent[]>(this.baseUrl);
    return response.data;
  }

  async deleteParent(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  async assignStudent(parentId: number, studentId: number): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${parentId}/assign-student`, { student_id: studentId });
  }

  async removeStudent(parentId: number, studentId: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${parentId}/remove-student/${studentId}`);
  }

  // PARENT endpoints
  async getMyChildren(): Promise<Child[]> {
    const response = await apiClient.get<Child[]>('api/parents/my-children');
    return response.data;
  }

  async getChildGrades(studentId: number): Promise<Grade[]> {
    const response = await apiClient.get<Grade[]>(`api/parents/child/${studentId}/grades`);
    return response.data;
  }

  async getChildSchedule(studentId: number): Promise<Schedule[]> {
    const response = await apiClient.get<Schedule[]>(`api/parents/child/${studentId}/schedule`);
    return response.data;
  }
}

export const parentApi = new ParentApi();