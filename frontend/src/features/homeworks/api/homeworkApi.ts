// src/features/homeworks/api/homeworkApi.ts
import apiClient from '../../../services/apiClient';
import type { Homework, CreateHomeworkDto, Submission, CreateSubmissionDto, GradeSubmissionDto } from '../types/homework.types';

class HomeworkApi {
  private readonly baseUrl = '/api/homeworks';
  private readonly submissionsUrl = '/api/submissions';

  async getHomeworks(): Promise<Homework[]> {
    const response = await apiClient.get<Homework[]>(this.baseUrl);
    return response.data;
  }

  async createHomework(data: CreateHomeworkDto): Promise<Homework> {
    const response = await apiClient.post<Homework>(this.baseUrl, data);
    return response.data;
  }

  async deleteHomework(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  async getMeta(): Promise<{ classes: any[]; subjects: any[] }> {
    const response = await apiClient.get(`${this.baseUrl}/meta`);
    return response.data;
  }

  async getSubmissions(homeworkId: number): Promise<Submission[]> {
    const response = await apiClient.get<Submission[]>(`${this.submissionsUrl}?homework_id=${homeworkId}`);
    return response.data;
  }

  // ✅ ДҰРЫС ЖОЛ - /api/submissions/me
  async getMySubmissions(): Promise<Submission[]> {
    const response = await apiClient.get<Submission[]>(`${this.submissionsUrl}/me`);
    return response.data;
  }

  async submitHomework(data: CreateSubmissionDto): Promise<Submission> {
    const response = await apiClient.post<Submission>(this.submissionsUrl, data);
    return response.data;
  }

  async gradeSubmission(id: number, data: GradeSubmissionDto): Promise<Submission> {
    const response = await apiClient.put<Submission>(`${this.submissionsUrl}/${id}/grade`, data);
    return response.data;
  }
}

export const homeworkApi = new HomeworkApi();