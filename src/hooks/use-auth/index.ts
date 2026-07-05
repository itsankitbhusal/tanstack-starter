import { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'react-toastify';
import { axiosClient } from '@/lib/api/axios-client';
import { useAuth } from '@/contexts/AuthContext';

interface LoginRequest {
  username: string;
  password: string;
  recaptchaToken?: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface ForgotPasswordRequest {
  emailOrPhone: string;
}

interface ResetPasswordRequest {
  emailOrPhone: string;
  otp: string;
  newPassword: string;
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setTokens } = useAuth();

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post<{ data: LoginResponse; message?: string }>('/oauth/token', credentials);

      if (response.status === 200 && response.data?.data) {
        const { access_token, refresh_token } = response.data.data;
        setTokens(access_token, refresh_token);
        toast.success('Login successful!');
        navigate({ to: '/dashboard' });
        return response;
      }

      const message = response.data?.message || 'Login failed';
      setError(message);
      toast.error(message);
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, setTokens]);

  return { login, isLoading, error };
}

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const forgotPassword = useCallback(async (data: ForgotPasswordRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await axiosClient.post<{ message?: string }>('/user-service/backoffice/auth/forgot-password', data);
      if (response.status === 200) {
        setSuccess(true);
        toast.success('Reset link sent to your email!');
        return response;
      }
      const message = response.data?.message || 'Failed to send reset link';
      setError(message);
      toast.error(message);
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { forgotPassword, isLoading, error, success };
}

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = useCallback(async (data: ResetPasswordRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await axiosClient.post<{ message?: string }>('/user-service/backoffice/auth/reset-password', data);
      if (response.status === 200) {
        setSuccess(true);
        toast.success('Password reset successfully!');
        return response;
      }
      const message = response.data?.message || 'Failed to reset password';
      setError(message);
      toast.error(message);
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { resetPassword, isLoading, error, success };
}

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await axiosClient.post('api/auth-service/api/v1/auth/logout');
    } catch {
      // Ignore logout API errors
    } finally {
      logout();
      setIsLoading(false);
    }
  }, [logout]);

  return { logout: handleLogout, isLoading };
}
