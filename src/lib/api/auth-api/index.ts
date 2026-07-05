import { apiClient, BASE_URL, refreshTokenAndRetry } from '../api-client';

export interface ApiResponse<T> {
  status: number;
  message?: string;
  data?: T;
}

export interface LoginRequest {
  username: string;
  password: string;
  recaptchaToken?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface ForgotPasswordRequest {
  emailOrPhone: string;
}

export interface ResetPasswordRequest {
  emailOrPhone: string;
  otp: string;
  newPassword: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const isDev = import.meta.env.DEV;
    const loginUrl = isDev ? '/api/oauth/token' : `${BASE_URL}/oauth/token`;
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    return {
      status: response.status,
      message: data.message || 'An error occurred',
      data: data.data || data,
    };
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<{ success: boolean }>> =>
    apiClient.post<{ success: boolean }>('/user-service/backoffice/auth/forgot-password', data),

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<{ success: boolean }>> =>
    apiClient.post<{ success: boolean }>('/user-service/backoffice/auth/reset-password', data),

  logout: async (): Promise<ApiResponse<null>> =>
    apiClient.post<null>('/api/auth-service/api/v1/auth/logout', undefined, { skipAuth: true }),

  init: async (): Promise<ApiResponse<Record<string, unknown>>> =>
    apiClient.get<Record<string, unknown>>('/user-service/rbac/init/after/web/admin'),

  getCurrentUser: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    const makeRequest = () => apiClient.get<Record<string, unknown>>('/user-service/rbac/init/after/web/admin');

    try {
      const response = await makeRequest();
      if (response.status === 401)
        return refreshTokenAndRetry(makeRequest) as Promise<ApiResponse<Record<string, unknown>>>;
      return response;
    } catch (error) {
      if ((error as { status?: number })?.status === 401)
        return refreshTokenAndRetry(makeRequest) as Promise<ApiResponse<Record<string, unknown>>>;
      throw error;
    }
  },
};
