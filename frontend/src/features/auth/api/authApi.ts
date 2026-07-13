// src/features/auth/api/authApi.ts
import apiClient from '../../../services/apiClient';
import type { User } from '../../../store/userStore';
import { userStore } from '../../../store/userStore';
export interface LoginCredentials {
  email: string;
  password: string;
}
export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}
export interface MeResponse {
  user: User;
}
class AuthApi {
  private readonly baseUrl = '/api/auth';
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        `${this.baseUrl}/login`,
        credentials
      );

      // token сақтау
      localStorage.setItem('token', response.data.token);

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // backend logout (если есть)
      await apiClient.post(`${this.baseUrl}/logout`);
    } catch (error) {
      console.warn('Logout API error (ignore):', error);
    } finally {
      localStorage.removeItem('token');
      userStore.getState().logout();
    }
  }

  async getMe(): Promise<User | null> {
    try {
      const response = await apiClient.get<MeResponse>(
        `${this.baseUrl}/me`
      );

      return response.data.user;
    } catch (error) {
      return null;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<{ user: User }>(
        `${this.baseUrl}/profile`,
        data
      );

      return response.data.user;
    } catch (error) {
      throw error;
    }
  }
}

// singleton
export const authApi = new AuthApi();