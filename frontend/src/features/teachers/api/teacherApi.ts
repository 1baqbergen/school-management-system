import apiClient from '../../../services/apiClient';
import type { CreateTeacherDto, UpdateTeacherDto } from '../types/teacher.types';

class TeacherApi {
  private readonly baseUrl = '/api/teachers';

  async getAll() {
    const response = await apiClient.get(this.baseUrl);
    return response.data;
  }

  async create(data: CreateTeacherDto) {
    const response = await apiClient.post(this.baseUrl, data);
    return response.data;
  }

  async update(id: number, data: UpdateTeacherDto) {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: number) {
    const response = await apiClient.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }
}
export const teacherApi = new TeacherApi();