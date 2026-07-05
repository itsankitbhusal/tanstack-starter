import Axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const isDev = import.meta.env.DEV;
export const BASE_URL = isDev ? '/api' : API_BASE_URL;

export const axiosClient = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuth?: boolean;
};

export const withSkippedAuth = (config: InternalAxiosRequestConfig): RetriableRequestConfig => ({
  ...config,
  skipAuth: true,
});

const shouldSkipAuth = (config: InternalAxiosRequestConfig): boolean =>
  (config as RetriableRequestConfig).skipAuth === true;

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

export const setupInterceptors = (
  getAccessToken: () => string | null,
  getRefreshToken: () => string | null,
  setTokens: (accessToken: string, refreshToken?: string | null) => void,
  clearTokens: () => void,
  onUnauthorized: () => void,
) => {
  axiosClient.interceptors.request.use(
     
    (config) => {
      if (shouldSkipAuth(config)) return config;
      const token = getAccessToken();
      if (token) config.headers.set('Authorization', `Bearer ${token}`);
      return config;
    },
    (error) => Promise.reject(error),
  );

  axiosClient.interceptors.response.use(
     
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetriableRequestConfig | undefined;

      if (!originalRequest || shouldSkipAuth(originalRequest)) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.set('Authorization', `Bearer ${token}`);
                resolve(axiosClient(originalRequest));
              },
              reject,
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          processQueue(error, null);
          onUnauthorized();
          return Promise.reject(error);
        }

        try {
          const response = await axiosClient.post('/oauth/refresh_token', {
            refreshToken,
          });

          const data = response.data?.data;
          const nextAccessToken = data?.access_token || data?.accessToken || null;
          const nextRefreshToken = data?.refresh_token || data?.refreshToken;

          if (!nextAccessToken) {
            processQueue(error, null);
            clearTokens();
            onUnauthorized();
            return Promise.reject(error);
          }

          setTokens(nextAccessToken, nextRefreshToken ?? refreshToken);
          processQueue(null, nextAccessToken);
          originalRequest.headers.set('Authorization', `Bearer ${nextAccessToken}`);
          return axiosClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          clearTokens();
          onUnauthorized();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );
};
