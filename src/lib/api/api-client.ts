import { tokenManager } from '@/lib/token-manager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const isDev = import.meta.env.DEV && API_BASE_URL.startsWith('http');
export const BASE_URL = isDev ? '/api' : API_BASE_URL;

export const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestInit & { skipAuth?: boolean } = {},
  ): Promise<{ status: number; data?: T; message?: string }> {
    const { skipAuth = false, ...fetchOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (!skipAuth) {
      const token = tokenManager.getAccessToken();
      if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    const data = await response.json();

    return {
      status: response.status,
      data: data.data,
      message: data.message,
    };
  },

  get<T>(endpoint: string, options?: RequestInit & { skipAuth?: boolean }) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestInit & { skipAuth?: boolean }) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: unknown, options?: RequestInit & { skipAuth?: boolean }) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: RequestInit & { skipAuth?: boolean }) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
};

export const refreshTokenAndRetry = async (
  originalRequest: () => Promise<unknown>,
): Promise<unknown> => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve: (token: string) => {
          tokenManager.setTokens(token);
          resolve(originalRequest());
        },
        reject,
      });
    });
  }

  isRefreshing = true;

  try {
    const newToken = await tokenManager.refreshAccessToken();
    if (!newToken) {
      processQueue(new Error('Session expired'), null);
      tokenManager.clearTokens();
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    processQueue(null, newToken);
    return originalRequest();
  } catch (error) {
    processQueue(error, null);
    throw error;
  } finally {
    isRefreshing = false;
  }
};
