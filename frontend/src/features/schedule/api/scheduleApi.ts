import apiClient from '../../../services/apiClient';
import type { CreateScheduleDto, Schedule, ScheduleMeta } from '../types/schedule.types';

class ScheduleApi {
  private readonly baseUrl = '/api/schedules';

  async getAll(): Promise<Schedule[]> {
    const res = await apiClient.get<Schedule[]>(this.baseUrl);
    return res.data;
  }

  async getMeta(): Promise<ScheduleMeta> {
    const res = await apiClient.get<ScheduleMeta>(`${this.baseUrl}/meta`);
    return res.data;
  }

  async create(data: CreateScheduleDto): Promise<any> {
    const res = await apiClient.post(this.baseUrl, data);
    return res.data;
  }

  async update(id: number, data: CreateScheduleDto): Promise<any> {
    const res = await apiClient.put(`${this.baseUrl}/${id}`, data);
    return res.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const scheduleApi = new ScheduleApi();