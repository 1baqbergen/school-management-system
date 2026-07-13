// src/features/ai/api/ai.api.ts
import apiClient from '../../../services/apiClient';
import type { SendMessageRequest, SendMessageResponse } from '../types/ai.types';

class AIApi {
  private readonly baseUrl = '/ai';

  async sendMessage(message: string): Promise<string> {
    try {
      const response = await apiClient.post<SendMessageResponse>(
        `/api${this.baseUrl}/ask`,
        { message } as SendMessageRequest
      );
      return response.data.answer;
    } catch (error) {
      console.error('AI API error:', error);
      throw error;
    }
  }
}

export const aiApi = new AIApi();